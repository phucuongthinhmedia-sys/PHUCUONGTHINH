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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const logger_service_1 = require("./logger.service");
let DatabaseOptimizationService = class DatabaseOptimizationService {
    prisma;
    logger;
    constructor(prisma, logger) {
        this.prisma = prisma;
        this.logger = logger;
        this.initializeOptimizations();
    }
    initializeOptimizations() {
        this.logger.log('Initializing database optimizations', {
            timestamp: new Date().toISOString(),
        });
        if (process.env.NODE_ENV !== 'production') {
            this.enableQueryLogging();
        }
    }
    enableQueryLogging() {
        this.logger.log('Query logging enabled for development', {
            environment: process.env.NODE_ENV,
        });
    }
    async getConnectionPoolStats() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Database connection pool error', error);
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
            };
        }
    }
    getProductQueryOptimizations() {
        return {
            recommendations: [
                'Use pagination with limit/offset for large result sets',
                'Filter by is_published status early in queries',
                'Use select() to fetch only required fields',
                'Batch load related data with include() instead of separate queries',
                'Cache frequently accessed products (top 100)',
            ],
            indexes: [
                'products.category_id',
                'products.is_published',
                'products.created_at',
                'products.technical_specs (JSONB)',
                'product_style_tags.style_id',
                'product_space_tags.space_id',
                'media.product_id',
                'media.sort_order',
            ],
        };
    }
    getLeadQueryOptimizations() {
        return {
            recommendations: [
                'Filter by status to reduce result set',
                'Use pagination for lead lists',
                'Cache lead counts by status',
                'Index created_at for date range queries',
            ],
            indexes: [
                'leads.status',
                'leads.created_at',
                'lead_products.lead_id',
                'lead_products.product_id',
            ],
        };
    }
    getMediaQueryOptimizations() {
        return {
            recommendations: [
                'Use sort_order for consistent media ordering',
                'Cache cover images separately',
                'Filter by media_type for specific asset types',
                'Use pagination for large media collections',
            ],
            indexes: [
                'media.product_id',
                'media.media_type',
                'media.sort_order',
                'media.is_cover',
            ],
        };
    }
    getOptimizationReport() {
        return {
            products: this.getProductQueryOptimizations(),
            leads: this.getLeadQueryOptimizations(),
            media: this.getMediaQueryOptimizations(),
            general: [
                'Use connection pooling for concurrent requests',
                'Implement query result caching for frequently accessed data',
                'Monitor slow queries and optimize as needed',
                'Use batch operations for bulk inserts/updates',
                'Implement pagination for all list endpoints',
                'Use database transactions for data consistency',
            ],
        };
    }
};
exports.DatabaseOptimizationService = DatabaseOptimizationService;
exports.DatabaseOptimizationService = DatabaseOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.LoggerService])
], DatabaseOptimizationService);
//# sourceMappingURL=database-optimization.service.js.map