import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { CombinedFilterService } from '../products/services/combined-filter.service';
import { ProductsEventService } from '../products/products-events.service';
import { validateFileType, validateFileSize } from './media-constants';

export interface StorageService {
  uploadFile(file: Buffer, folder: string): Promise<string>;
  getPublicUrl(key: string): string;
  generateS3Key(productId: string, filename: string, mediaType: string): string;
}

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    private combinedFilterService: CombinedFilterService,
    private eventsService: ProductsEventService,
  ) {}

  private emitUpdated(productId: string) {
    this.eventsService.emit({
      type: 'updated',
      productId,
      timestamp: new Date().toISOString(),
    });
  }

  async uploadFile(
    productId: string,
    file: Express.Multer.File,
    mediaType: string,
  ): Promise<string> {
    if (!validateFileType(file.originalname, mediaType)) {
      throw new BadRequestException(
        `Invalid file type for media type "${mediaType}"`,
      );
    }
    if (!validateFileSize(file.size, mediaType)) {
      throw new BadRequestException(
        `File size exceeds limit for media type "${mediaType}"`,
      );
    }
    const folder = `products/${productId}/${mediaType}`;
    return this.storageService.uploadFile(file.buffer, folder);
  }

  async create(createMediaDto: CreateMediaDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: createMediaDto.product_id },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Resolve sort_order before transaction
    if (createMediaDto.sort_order === undefined) {
      const last = await this.prisma.media.findFirst({
        where: { product_id: createMediaDto.product_id },
        orderBy: { sort_order: 'desc' },
      });
      createMediaDto.sort_order = (last?.sort_order ?? 0) + 1;
    }

    // Atomic: unset old cover + create new record
    const [, media] = await this.prisma.$transaction([
      ...(createMediaDto.is_cover
        ? [
            this.prisma.media.updateMany({
              where: { product_id: createMediaDto.product_id, is_cover: true },
              data: { is_cover: false },
            }),
          ]
        : []),
      this.prisma.media.create({ data: createMediaDto }),
    ] as any);

    this.combinedFilterService.clearProductCaches(createMediaDto.product_id);
    this.emitUpdated(createMediaDto.product_id);
    return media;
  }

  async findAll() {
    return this.prisma.media.findMany({
      include: { product: { select: { id: true, name: true, sku: true } } },
      orderBy: [{ product_id: 'asc' }, { sort_order: 'asc' }],
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.media.findMany({
      where: { product_id: productId },
      orderBy: { sort_order: 'asc' },
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: { product: { select: { id: true, name: true, sku: true } } },
    });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    const existing = await this.findOne(id);

    // Atomic: unset old cover + update record
    const ops: any[] = [];
    if (updateMediaDto.is_cover) {
      ops.push(
        this.prisma.media.updateMany({
          where: {
            product_id: existing.product_id,
            is_cover: true,
            id: { not: id },
          },
          data: { is_cover: false },
        }),
      );
    }
    ops.push(this.prisma.media.update({ where: { id }, data: updateMediaDto }));

    const results = await this.prisma.$transaction(ops);
    const result = results[results.length - 1];

    this.combinedFilterService.clearProductCaches(existing.product_id);
    this.emitUpdated(existing.product_id);
    return result;
  }

  async remove(id: string) {
    const media = await this.findOne(id);
    const result = await this.prisma.media.delete({ where: { id } });
    this.combinedFilterService.clearProductCaches(media.product_id);
    this.emitUpdated(media.product_id);
    return result;
  }

  async updateSortOrder(
    productId: string,
    mediaOrders: { id: string; sort_order: number }[],
  ) {
    const mediaIds = mediaOrders.map((m) => m.id);
    const existing = await this.prisma.media.findMany({
      where: { id: { in: mediaIds }, product_id: productId },
    });
    if (existing.length !== mediaIds.length) {
      throw new BadRequestException(
        'Some media items do not belong to this product',
      );
    }

    const result = await this.prisma.$transaction(
      mediaOrders.map(({ id, sort_order }) =>
        this.prisma.media.update({ where: { id }, data: { sort_order } }),
      ),
    );

    this.combinedFilterService.clearProductCaches(productId);
    this.emitUpdated(productId); // Fix: was missing before
    return result;
  }
}
