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
var ImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("./storage.service");
const pdf_service_1 = require("./pdf.service");
const ai_service_1 = require("./ai.service");
const category_mapper_service_1 = require("./category-mapper.service");
let ImportService = ImportService_1 = class ImportService {
    prisma;
    storageService;
    pdfService;
    aiService;
    categoryMapper;
    logger = new common_1.Logger(ImportService_1.name);
    constructor(prisma, storageService, pdfService, aiService, categoryMapper) {
        this.prisma = prisma;
        this.storageService = storageService;
        this.pdfService = pdfService;
        this.aiService = aiService;
        this.categoryMapper = categoryMapper;
    }
    async createJob(file, userId) {
        this.logger.log(`Creating import job for file: ${file.originalname}`);
        if (!file.mimetype.includes('pdf')) {
            throw new Error('File must be a PDF');
        }
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size must be less than 50MB');
        }
        const filePath = await this.storageService.savePDF(file);
        const isValid = await this.pdfService.validatePdf(filePath);
        if (!isValid) {
            await this.storageService.deleteFile(filePath);
            throw new Error('Invalid PDF file');
        }
        const pageCount = await this.pdfService.getPageCount(filePath);
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
    async processJobAsync(jobId) {
        try {
            const importJob = await this.prisma.importJob.findUnique({
                where: { id: jobId },
            });
            if (!importJob) {
                throw new Error(`Import job ${jobId} not found`);
            }
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: {
                    status: 'PROCESSING',
                    started_at: new Date(),
                },
            });
            const pageCount = importJob.total_pages;
            this.logger.log(`Processing ${pageCount} pages for job ${jobId}`);
            for (let i = 1; i <= pageCount; i++) {
                try {
                    await this.prisma.importJob.update({
                        where: { id: jobId },
                        data: {
                            current_page: i,
                            progress: Math.floor((i / pageCount) * 100),
                        },
                    });
                    const imageBuffer = await this.pdfService.convertPageToImage(importJob.file_path, i);
                    const extractedProducts = await this.aiService.extractProducts(imageBuffer, i);
                    for (const product of extractedProducts) {
                        const categoryId = await this.categoryMapper.mapCategory(product.category || 'other');
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
                    this.logger.log(`Processed page ${i}/${pageCount}: ${extractedProducts.length} products`);
                }
                catch (error) {
                    this.logger.error(`Failed to process page ${i}: ${error.message}`);
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
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: {
                    status: 'COMPLETED',
                    completed_at: new Date(),
                    progress: 100,
                },
            });
            this.logger.log(`Import job ${jobId} completed`);
        }
        catch (error) {
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
    async getJobStatus(jobId) {
        const job = await this.prisma.importJob.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Import job ${jobId} not found`);
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
    async getExtractedProducts(jobId) {
        const job = await this.prisma.importJob.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Import job ${jobId} not found`);
        }
        const products = await this.prisma.extractedProduct.findMany({
            where: { import_job_id: jobId },
            orderBy: [{ page_number: 'asc' }, { created_at: 'asc' }],
        });
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
    async bulkCreateProducts(jobId, productIds) {
        this.logger.log(`Bulk creating ${productIds.length} products from job ${jobId}`);
        const results = {
            success: [],
            failed: [],
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
                if (!extracted.name || !extracted.category_id) {
                    results.failed.push({
                        id: productId,
                        error: 'Missing required fields (name or category)',
                    });
                    continue;
                }
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
                const product = await this.prisma.product.create({
                    data: {
                        name: extracted.name,
                        sku: extracted.sku || `AUTO-${Date.now()}`,
                        description: extracted.description,
                        category_id: extracted.category_id,
                        technical_specs: JSON.stringify(specs),
                        is_published: false,
                    },
                });
                results.success.push(product.id);
                this.logger.log(`Created product: ${product.id} (${product.name})`);
            }
            catch (error) {
                this.logger.error(`Failed to create product ${productId}: ${error.message}`);
                results.failed.push({
                    id: productId,
                    error: error.message,
                });
            }
        }
        this.logger.log(`Bulk create completed: ${results.success.length} success, ${results.failed.length} failed`);
        return results;
    }
    async updateExtractedProduct(productId, data) {
        const product = await this.prisma.extractedProduct.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Extracted product ${productId} not found`);
        }
        return this.prisma.extractedProduct.update({
            where: { id: productId },
            data: {
                ...data,
                user_edited: true,
                technical_specs: typeof data.technical_specs === 'string'
                    ? data.technical_specs
                    : JSON.stringify(data.technical_specs || {}),
            },
        });
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = ImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        pdf_service_1.PdfService,
        ai_service_1.AiService,
        category_mapper_service_1.CategoryMapperService])
], ImportService);
//# sourceMappingURL=import.service.js.map