import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { AiService } from './ai.service';

interface ImportJobData {
  import_job_id: string;
}

@Processor('import-queue')
export class ImportProcessor extends WorkerHost {
  private readonly logger = new Logger(ImportProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly aiService: AiService,
  ) {
    super();
  }

  async process(job: Job<ImportJobData>): Promise<void> {
    const { import_job_id } = job.data;

    this.logger.log(`Processing import job: ${import_job_id}`);

    try {
      // Get import job from database
      const importJob = await this.prisma.importJob.findUnique({
        where: { id: import_job_id },
      });

      if (!importJob) {
        throw new Error(`Import job ${import_job_id} not found`);
      }

      // Update status to PROCESSING
      await this.prisma.importJob.update({
        where: { id: import_job_id },
        data: {
          status: 'PROCESSING',
          started_at: new Date(),
        },
      });

      // Convert PDF to images
      this.logger.log(`Converting PDF to images: ${importJob.file_path}`);
      const images = await this.pdfService.convertToImages(importJob.file_path);

      this.logger.log(`PDF converted to ${images.length} images`);

      // Process each page
      const failedPages: number[] = [];

      for (let i = 0; i < images.length; i++) {
        const pageNumber = i + 1;

        try {
          // Update progress
          const progress = Math.floor(((i + 1) / images.length) * 100);
          await this.prisma.importJob.update({
            where: { id: import_job_id },
            data: {
              current_page: pageNumber,
              progress,
            },
          });

          await job.updateProgress(progress);

          this.logger.log(`Processing page ${pageNumber}/${images.length}`);

          // Extract products using AI
          const products = await this.aiService.extractProducts(
            images[i],
            pageNumber,
          );

          this.logger.log(
            `Extracted ${products.length} products from page ${pageNumber}`,
          );

          // Save extracted products to database
          for (const product of products) {
            await this.prisma.extractedProduct.create({
              data: {
                import_job_id,
                page_number: pageNumber,
                name: product.name,
                sku: product.sku,
                description: product.description,
                category: product.category,
                technical_specs: JSON.stringify(product.specs || {}),
                price_retail: product.price_retail,
                price_dealer: product.price_dealer,
                unit: product.unit,
                images: JSON.stringify([]), // Will be populated later if needed
                ai_raw_response: JSON.stringify(product),
                validation_status: this.validateProduct(product),
                validation_errors: JSON.stringify(
                  this.getValidationErrors(product),
                ),
              },
            });
          }
        } catch (error) {
          this.logger.error(
            `Failed to process page ${pageNumber}: ${error.message}`,
            error.stack,
          );
          failedPages.push(pageNumber);

          // Continue with next page instead of failing entire job
          continue;
        }
      }

      // Update job status to COMPLETED
      await this.prisma.importJob.update({
        where: { id: import_job_id },
        data: {
          status: 'COMPLETED',
          completed_at: new Date(),
          progress: 100,
          failed_pages: JSON.stringify(failedPages),
        },
      });

      this.logger.log(
        `Import job ${import_job_id} completed. Failed pages: ${failedPages.length}`,
      );
    } catch (error) {
      this.logger.error(
        `Import job ${import_job_id} failed: ${error.message}`,
        error.stack,
      );

      // Update job status to FAILED
      await this.prisma.importJob.update({
        where: { id: import_job_id },
        data: {
          status: 'FAILED',
          completed_at: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Validate extracted product and return status
   */
  private validateProduct(product: any): string {
    const errors = this.getValidationErrors(product);

    if (errors.length === 0) {
      return 'VALID';
    }

    // Check if errors are critical
    const hasCriticalError = errors.some(
      (err) => err.includes('Tên sản phẩm') || err.includes('SKU trùng'),
    );

    return hasCriticalError ? 'ERROR' : 'WARNING';
  }

  /**
   * Get validation errors for a product
   */
  private getValidationErrors(product: any): string[] {
    const errors: string[] = [];

    if (!product.name || product.name.trim() === '') {
      errors.push('Tên sản phẩm là bắt buộc');
    }

    if (!product.sku || product.sku.trim() === '') {
      errors.push('SKU bị thiếu');
    }

    if (!product.category) {
      errors.push('Danh mục chưa được xác định');
    }

    if (!product.price_retail) {
      errors.push('Giá bán lẻ bị thiếu');
    }

    if (!product.unit) {
      errors.push('Đơn vị tính bị thiếu');
    }

    return errors;
  }
}
