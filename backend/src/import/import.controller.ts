import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImportService } from './import.service';
import { BulkCreateDto } from './dto/bulk-create.dto';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  /**
   * Upload catalogue PDF and create import job
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async uploadCatalogue(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const userId = req.user.id; // Fixed: use 'id' instead of 'userId'
    return this.importService.createJob(file, userId);
  }

  /**
   * Get import job status
   */
  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    return this.importService.getJobStatus(id);
  }

  /**
   * Get extracted products for a job
   */
  @Get('jobs/:id/products')
  async getExtractedProducts(@Param('id') id: string) {
    return this.importService.getExtractedProducts(id);
  }

  /**
   * Bulk create products from extracted data
   */
  @Post('jobs/:id/bulk-create')
  async bulkCreate(@Param('id') id: string, @Body() dto: BulkCreateDto) {
    return this.importService.bulkCreateProducts(id, dto.product_ids);
  }

  /**
   * Update extracted product (when user edits in preview)
   */
  @Post('products/:id')
  async updateExtractedProduct(@Param('id') id: string, @Body() data: any) {
    return this.importService.updateExtractedProduct(id, data);
  }
}
