"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MediaService = class MediaService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async create(createMediaDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: createMediaDto.product_id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (createMediaDto.is_cover) {
            await this.prisma.media.updateMany({
                where: {
                    product_id: createMediaDto.product_id,
                    is_cover: true,
                },
                data: { is_cover: false },
            });
        }
        if (createMediaDto.sort_order === undefined) {
            const lastMedia = await this.prisma.media.findFirst({
                where: { product_id: createMediaDto.product_id },
                orderBy: { sort_order: 'desc' },
            });
            createMediaDto.sort_order = (lastMedia?.sort_order || 0) + 1;
        }
        return this.prisma.media.create({
            data: createMediaDto,
        });
    }
    async findAll() {
        return this.prisma.media.findMany({
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                    },
                },
            },
            orderBy: [{ product_id: 'asc' }, { sort_order: 'asc' }],
        });
    }
    async findByProductId(productId) {
        return this.prisma.media.findMany({
            where: { product_id: productId },
            orderBy: { sort_order: 'asc' },
        });
    }
    async findOne(id) {
        const media = await this.prisma.media.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                    },
                },
            },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        return media;
    }
    async update(id, updateMediaDto) {
        const existingMedia = await this.findOne(id);
        if (updateMediaDto.is_cover) {
            await this.prisma.media.updateMany({
                where: {
                    product_id: existingMedia.product_id,
                    is_cover: true,
                    id: { not: id },
                },
                data: { is_cover: false },
            });
        }
        return this.prisma.media.update({
            where: { id },
            data: updateMediaDto,
        });
    }
    async remove(id) {
        const media = await this.findOne(id);
        return this.prisma.media.delete({
            where: { id },
        });
    }
    async getPresignedUploadUrl(productId, getPresignedUrlDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!this.storageService.validateFileType(getPresignedUrlDto.filename, getPresignedUrlDto.media_type)) {
            throw new common_1.BadRequestException(`Invalid file type for media type ${getPresignedUrlDto.media_type}`);
        }
        const s3Key = this.storageService.generateS3Key(productId, getPresignedUrlDto.filename, getPresignedUrlDto.media_type);
        const uploadUrl = await this.storageService.getPresignedUploadUrl(s3Key, getPresignedUrlDto.content_type);
        return {
            upload_url: uploadUrl,
            s3_key: s3Key,
            public_url: this.storageService.getPublicUrl(s3Key),
        };
    }
    async getDownloadUrl(id) {
        const media = await this.findOne(id);
        const s3Key = this.extractS3KeyFromUrl(media.file_url);
        const downloadUrl = await this.storageService.getPresignedDownloadUrl(s3Key);
        return {
            download_url: downloadUrl,
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        };
    }
    extractS3KeyFromUrl(fileUrl) {
        const url = new URL(fileUrl);
        return url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
    }
    async updateSortOrder(productId, mediaOrders) {
        const mediaIds = mediaOrders.map((m) => m.id);
        const existingMedia = await this.prisma.media.findMany({
            where: {
                id: { in: mediaIds },
                product_id: productId,
            },
        });
        if (existingMedia.length !== mediaIds.length) {
            throw new common_1.BadRequestException('Some media items do not belong to this product');
        }
        return this.prisma.$transaction(mediaOrders.map(({ id, sort_order }) => this.prisma.media.update({
            where: { id },
            data: { sort_order },
        })));
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('STORAGE_SERVICE')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], MediaService);
//# sourceMappingURL=media.service.js.map