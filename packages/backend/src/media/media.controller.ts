import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UPLOAD_ENDPOINT_MAX_SIZE } from './media-constants';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('STORAGE_SERVICE') private readonly storageService: any,
  ) {}

  @Post('products/:productId/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: UPLOAD_ENDPOINT_MAX_SIZE } }),
  )
  async uploadFile(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('media_type') mediaType: string = 'lifestyle',
  ) {
    const url = await this.mediaService.uploadFile(productId, file, mediaType);
    return { url };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.mediaService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.mediaService.findByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updatePut(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }

  @Patch('products/:productId/sort-order')
  @UseGuards(JwtAuthGuard)
  updateSortOrder(
    @Param('productId') productId: string,
    @Body() mediaOrders: { id: string; sort_order: number }[],
  ) {
    return this.mediaService.updateSortOrder(productId, mediaOrders);
  }
}
