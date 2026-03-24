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
var ImportProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdf_service_1 = require("./pdf.service");
const ai_service_1 = require("./ai.service");
let ImportProcessor = ImportProcessor_1 = class ImportProcessor extends bullmq_1.WorkerHost {
    prisma;
    pdfService;
    aiService;
    logger = new common_1.Logger(ImportProcessor_1.name);
    constructor(prisma, pdfService, aiService) {
        super();
        this.prisma = prisma;
        this.pdfService = pdfService;
        this.aiService = aiService;
    }
    async process(job) {
        const { import_job_id } = job.data;
        this.logger.log(`Processing import job: ${import_job_id}`);
        try {
            const importJob = await this.prisma.importJob.findUnique({
                where: { id: import_job_id },
            });
            if (!importJob) {
                throw new Error(`Import job ${import_job_id} not found`);
            }
            await this.prisma.importJob.update({
                where: { id: import_job_id },
                data: {
                    status: 'PROCESSING',
                    started_at: new Date(),
                },
            });
            this.logger.log(`Converting PDF to images: ${importJob.file_path}`);
            const images = await this.pdfService.convertToImages(importJob.file_path);
            this.logger.log(`PDF converted to ${images.length} images`);
            const failedPages = [];
            for (let i = 0; i < images.length; i++) {
                const pageNumber = i + 1;
                try {
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
                    const products = await this.aiService.extractProducts(images[i], pageNumber);
                    this.logger.log(`Extracted ${products.length} products from page ${pageNumber}`);
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
                                images: JSON.stringify([]),
                                ai_raw_response: JSON.stringify(product),
                                validation_status: this.validateProduct(product),
                                validation_errors: JSON.stringify(this.getValidationErrors(product)),
                            },
                        });
                    }
                }
                catch (error) {
                    this.logger.error(`Failed to process page ${pageNumber}: ${error.message}`, error.stack);
                    failedPages.push(pageNumber);
                    continue;
                }
            }
            await this.prisma.importJob.update({
                where: { id: import_job_id },
                data: {
                    status: 'COMPLETED',
                    completed_at: new Date(),
                    progress: 100,
                    failed_pages: JSON.stringify(failedPages),
                },
            });
            this.logger.log(`Import job ${import_job_id} completed. Failed pages: ${failedPages.length}`);
        }
        catch (error) {
            this.logger.error(`Import job ${import_job_id} failed: ${error.message}`, error.stack);
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
    validateProduct(product) {
        const errors = this.getValidationErrors(product);
        if (errors.length === 0) {
            return 'VALID';
        }
        const hasCriticalError = errors.some((err) => err.includes('Tên sản phẩm') || err.includes('SKU trùng'));
        return hasCriticalError ? 'ERROR' : 'WARNING';
    }
    getValidationErrors(product) {
        const errors = [];
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
};
exports.ImportProcessor = ImportProcessor;
exports.ImportProcessor = ImportProcessor = ImportProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('import-queue'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_service_1.PdfService,
        ai_service_1.AiService])
], ImportProcessor);
//# sourceMappingURL=import.processor.js.map