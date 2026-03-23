import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { PdfService } from './pdf.service';
import { AiService } from './ai.service';
import { CategoryMapperService } from './category-mapper.service';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly pdfService: PdfService,
    private readonly aiService: AiService,
    private readonly categoryMapper: CategoryMapperService,
  ) {}

  /**
   * Create import job and process immediately (synchronous for MVP)
   */
  async createJob(file: Express.Multer.File, userId: string) {
    this.logger.log(`Creating import job for file: ${file.originalname}`);

    // Validate file
    if (!file.mimetype.includes('pdf')) {
      throw new Error('File must be a PDF');
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB');
    }

    // Save file to storage
    const filePath = await this.storageService.savePDF(file);

    // Validate PDF
    const isValid = await this.pdfService.validatePdf(filePath);
    if (!isValid) {
      await this.storageService.deleteFile(filePath);
      throw new Error('Invalid PDF file');
    }

    // Get page count
    const pageCount = await this.pdfService.getPageCount(filePath);

    // Create import job record
    const importJob = await this.prisma.importJob.create({
      data: {
        user_id: userId,
        file_name: file.originalname,
        file_path: filePath,
        file_size: file.size,
        total_pages: pageCount,
        status: 'PENDING',
      },
    });

    // Process immediately in background (fire and forget)
    this.processJobAsync(importJob.id).catch((error) => {
      this.logger.error(`Job ${importJob.id} failed: ${error.message}`);
    });

    this.logger.log(`Import job created: ${importJob.id}`);

    return {
      job_id: importJob.id,
      status: 'pending',
      total_pages: pageCount,
    };
  }

  /**
   * Process import job asynchronously (without queue)
   */
  private async processJobAsync(jobId: string) {
    try {
      const importJob = await this.prisma.importJob.findUnique({
        where: { id: jobId },
      });

      if (!importJob) {
        throw new Error(`Import job ${jobId} not found`);
      }

      // Update status to PROCESSING
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'PROCESSING',
          started_at: new Date(),
        },
      });

      const pageCount = importJob.total_pages;
      this.logger.log(`Processing ${pageCount} pages for job ${jobId}`);

      // Process each page with AI extraction
      for (let i = 1; i <= pageCount; i++) {
        try {
          // Update progress
          await this.prisma.importJob.update({
            where: { id: jobId },
            data: {
              current_page: i,
              progress: Math.floor((i / pageCount) * 100),
            },
          });

          // Convert PDF page to image
          const imageBuffer = await this.pdfService.convertPageToImage(
            importJob.file_path,
            i,
          );

          // Extract products using AI
          const extractedProducts = await this.aiService.extractProducts(
            imageBuffer,
            i,
          );

          // Save extracted products to database
          for (const product of extractedProducts) {
            // Map category to category_id
            const categoryId = await this.categoryMapper.mapCategory(
              product.category || 'other',
            );

            await this.prisma.extractedProduct.create({
              data: {
                import_job_id: jobId,
                page_number: i,
                name: product.name,
                sku: product.sku || `AUTO-${Date.now()}-${i}`,
                description: product.description,
                category: product.category,
                category_id: categoryId,
                technical_specs: JSON.stringify(product.specs || {}),
                price_retail: product.price_retail,
                price_dealer: product.price_dealer,
                unit: product.unit || 'M2',
                images: JSON.stringify([]),
                ai_raw_response: JSON.stringify(product),
                validation_status: 'VALID',
                validation_errors: JSON.stringify([]),
              },
            });
          }

          this.logger.log(
            `Processed page ${i}/${pageCount}: ${extractedProducts.length} products`,
          );
        } catch (error) {
          this.logger.error(`Failed to process page ${i}: ${error.message}`);
          // Continue with next page even if one fails
          const currentFailedPages = JSON.parse(importJob.failed_pages || '[]');
          currentFailedPages.push(i);
          await this.prisma.importJob.update({
            where: { id: jobId },
            data: {
              failed_pages: JSON.stringify(currentFailedPages),
            },
          });
        }
      }

      // Mark as completed
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          completed_at: new Date(),
          progress: 100,
        },
      });

      this.logger.log(`Import job ${jobId} completed`);
    } catch (error) {
      this.logger.error(`Job ${jobId} failed: ${error.message}`);
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          completed_at: new Date(),
        },
      });
    }
  }

  /**
   * Get import job status
   */
  async getJobStatus(jobId: string) {
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Import job ${jobId} not found`);
    }

    const failedPages = JSON.parse(job.failed_pages || '[]');

    return {
      id: job.id,
      file_name: job.file_name,
      status: job.status.toLowerCase(),
      progress: job.progress,
      current_page: job.current_page,
      total_pages: job.total_pages,
      failed_pages: failedPages,
      started_at: job.started_at,
      completed_at: job.completed_at,
      created_at: job.created_at,
    };
  }

  /**
   * Get extracted products for a job
   */
  async getExtractedProducts(jobId: string) {
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Import job ${jobId} not found`);
    }

    const products = await this.prisma.extractedProduct.findMany({
      where: { import_job_id: jobId },
      orderBy: [{ page_number: 'asc' }, { created_at: 'asc' }],
    });

    // Map categories for products that don't have one
    for (const product of products) {
      if (!product.category_id && product.name) {
        const categoryId = await this.categoryMapper.mapCategory(product.name);
        if (categoryId) {
          await this.prisma.extractedProduct.update({
            where: { id: product.id },
            data: { category_id: categoryId },
          });
          product.category_id = categoryId;
        }
      }
    }

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      description: p.description,
      category: p.category,
      category_id: p.category_id,
      technical_specs: JSON.parse(p.technical_specs),
      price_retail: p.price_retail,
      price_dealer: p.price_dealer,
      unit: p.unit,
      images: JSON.parse(p.images),
      validation_status: p.validation_status.toLowerCase(),
      validation_errors: JSON.parse(p.validation_errors),
      user_edited: p.user_edited,
      page_number: p.page_number,
    }));
  }

  /**
   * Bulk create products from extracted data
   */
  async bulkCreateProducts(jobId: string, productIds: string[]) {
    this.logger.log(
      `Bulk creating ${productIds.length} products from job ${jobId}`,
    );

    const results = {
      success: [] as string[],
      failed: [] as { id: string; error: string }[],
    };

    for (const productId of productIds) {
      try {
        const extracted = await this.prisma.extractedProduct.findUnique({
          where: { id: productId },
        });

        if (!extracted) {
          results.failed.push({
            id: productId,
            error: 'Extracted product not found',
          });
          continue;
        }

        // Check if SKU already exists
        if (extracted.sku) {
          const existing = await this.prisma.product.findUnique({
            where: { sku: extracted.sku },
          });

          if (existing) {
            results.failed.push({
              id: productId,
              error: `SKU ${extracted.sku} already exists`,
            });
            continue;
          }
        }

        // Validate required fields
        if (!extracted.name || !extracted.category_id) {
          results.failed.push({
            id: productId,
            error: 'Missing required fields (name or category)',
          });
          continue;
        }

        // Merge price into technical_specs
        const specs = JSON.parse(extracted.technical_specs);
        if (extracted.price_retail) {
          specs.price_retail = extracted.price_retail;
        }
        if (extracted.price_dealer) {
          specs.price_dealer = extracted.price_dealer;
        }
        if (extracted.unit) {
          specs.unit = extracted.unit;
        }

        // Create product
        const product = await this.prisma.product.create({
          data: {
            name: extracted.name,
            sku: extracted.sku || `AUTO-${Date.now()}`,
            description: extracted.description,
            category_id: extracted.category_id,
            technical_specs: JSON.stringify(specs),
            is_published: false, // Draft mode
          },
        });

        results.success.push(product.id);

        this.logger.log(`Created product: ${product.id} (${product.name})`);
      } catch (error) {
        this.logger.error(
          `Failed to create product ${productId}: ${error.message}`,
        );
        results.failed.push({
          id: productId,
          error: error.message,
        });
      }
    }

    this.logger.log(
      `Bulk create completed: ${results.success.length} success, ${results.failed.length} failed`,
    );

    return results;
  }

  /**
   * Update extracted product (when user edits)
   */
  async updateExtractedProduct(productId: string, data: any) {
    const product = await this.prisma.extractedProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Extracted product ${productId} not found`);
    }

    return this.prisma.extractedProduct.update({
      where: { id: productId },
      data: {
        ...data,
        user_edited: true,
        technical_specs:
          typeof data.technical_specs === 'string'
            ? data.technical_specs
            : JSON.stringify(data.technical_specs || {}),
      },
    });
  }
}
