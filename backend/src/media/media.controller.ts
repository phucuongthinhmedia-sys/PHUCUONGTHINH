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
  Query,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { GetPresignedUrlDto } from './dto/upload-media.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalStorageService } from './local-storage.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly localStorageService: LocalStorageService,
  ) {}

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

  @Post('products/:productId/presigned-url')
  @UseGuards(JwtAuthGuard)
  getPresignedUploadUrl(
    @Param('productId') productId: string,
    @Body() getPresignedUrlDto: GetPresignedUrlDto,
  ) {
    return this.mediaService.getPresignedUploadUrl(
      productId,
      getPresignedUrlDto,
    );
  }

  @Get(':id/download')
  getDownloadUrl(@Param('id') id: string) {
    return this.mediaService.getDownloadUrl(id);
  }

  @Patch('products/:productId/sort-order')
  @UseGuards(JwtAuthGuard)
  updateSortOrder(
    @Param('productId') productId: string,
    @Body() mediaOrders: { id: string; sort_order: number }[],
  ) {
    return this.mediaService.updateSortOrder(productId, mediaOrders);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body('key') key: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    if (!key) {
      return { success: false, message: 'No key provided' };
    }

    await this.localStorageService.saveFile(key, file.buffer);
    return { success: true, url: this.localStorageService.getPublicUrl(key) };
  }
}
