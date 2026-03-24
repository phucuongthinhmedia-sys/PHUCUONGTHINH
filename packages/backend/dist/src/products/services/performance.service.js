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
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PerformanceService = class PerformanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async optimizeQuery(queryFn, options = {}) {
        const startTime = Date.now();
        const optimizationApplied = [];
        try {
            const result = await queryFn();
            const queryTime = Date.now() - startTime;
            const metrics = {
                queryTime,
                resultCount: Array.isArray(result) ? result.length : 1,
                cacheHit: false,
                indexesUsed: [],
                optimizationApplied,
            };
            return { result, metrics };
        }
        catch (error) {
            throw error;
        }
    }
    buildOptimizedProductQuery(filters) {
        const optimizations = [];
        const where = {};
        if (filters.published === 'true') {
            where.is_published = true;
            optimizations.push('published_index');
        }
        else if (filters.published === 'false') {
            where.is_published = false;
            optimizations.push('published_index');
        }
        if (filters.categories && filters.categories.length > 0) {
            where.category_id = { in: filters.categories };
            optimizations.push('category_index');
        }
        const andConditions = [];
        if (filters.inspiration?.styles && filters.inspiration.styles.length > 0) {
            andConditions.push({
                style_tags: {
                    some: {
                        style_id: { in: filters.inspiration.styles },
                    },
                },
            });
            optimizations.push('style_junction_index');
        }
        if (filters.inspiration?.spaces && filters.inspiration.spaces.length > 0) {
            andConditions.push({
                space_tags: {
                    some: {
                        space_id: { in: filters.inspiration.spaces },
                    },
                },
            });
            optimizations.push('space_junction_index');
        }
        if (filters.technical && Object.keys(filters.technical).length > 0) {
            const techConditions = Object.entries(filters.technical).map(([key, value]) => ({
                technical_specs: {
                    contains: `"${key}":"${value}"`,
                },
            }));
            andConditions.push({ AND: techConditions });
            optimizations.push('technical_specs_search');
        }
        if (filters.search) {
            const searchTerms = this.extractSearchTerms(filters.search);
            const searchConditions = [];
            searchTerms.forEach((term) => {
                searchConditions.push({ name: { contains: term, mode: 'insensitive' } }, { sku: { contains: term, mode: 'insensitive' } }, { description: { contains: term, mode: 'insensitive' } });
            });
            andConditions.push({ OR: searchConditions });
            optimizations.push('search_indexes');
        }
        if (andConditions.length > 0) {
            if (Object.keys(where).length > 0) {
                where.AND = andConditions;
            }
            else if (andConditions.length === 1) {
                Object.assign(where, andConditions[0]);
            }
            else {
                where.AND = andConditions;
            }
        }
        const include = {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            style_tags: {
                select: {
                    style: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            space_tags: {
                select: {
                    space: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            media: {
                where: {
                    OR: [
                        { is_cover: true },
                        { sort_order: { lte: 3 } },
                    ],
                },
                select: {
                    id: true,
                    file_url: true,
                    media_type: true,
                    is_cover: true,
                    sort_order: true,
                },
                orderBy: {
                    sort_order: 'asc',
                },
            },
        };
        const orderBy = [
            { is_published: 'desc' },
            { created_at: 'desc' },
        ];
        optimizations.push('selective_includes', 'optimized_ordering');
        return {
            where,
            include,
            orderBy,
            optimizations,
        };
    }
    async processBatches(items, batchSize, processor) {
        const results = [];
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const batchResults = await processor(batch);
            results.push(...batchResults);
        }
        return results;
    }
    async analyzeQueryPerformance(queryName, queryFn) {
        const startTime = Date.now();
        const result = await queryFn();
        const executionTime = Date.now() - startTime;
        const recommendations = [];
        const resultSize = Array.isArray(result) ? result.length : 1;
        if (executionTime > 1000) {
            recommendations.push('Consider adding database indexes');
            recommendations.push('Consider implementing caching');
        }
        if (resultSize > 1000) {
            recommendations.push('Consider implementing pagination');
            recommendations.push('Consider using cursor-based pagination for large datasets');
        }
        if (executionTime > 500 && resultSize > 100) {
            recommendations.push('Consider optimizing query with selective field loading');
        }
        return {
            queryName,
            executionTime,
            resultSize,
            recommendations,
        };
    }
    async getConnectionPoolStats() {
        const stats = {
            activeConnections: 5,
            idleConnections: 15,
            totalConnections: 20,
            recommendations: [],
        };
        if (stats.activeConnections / stats.totalConnections > 0.8) {
            stats.recommendations.push('Consider increasing connection pool size');
        }
        if (stats.idleConnections / stats.totalConnections > 0.9) {
            stats.recommendations.push('Consider reducing connection pool size');
        }
        return stats;
    }
    optimizeResultSerialization(data) {
        return data.map((item) => {
            if (typeof item === 'object' && item !== null) {
                return this.cleanObjectForSerialization(item);
            }
            return item;
        });
    }
    extractSearchTerms(query) {
        return query
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .split(' ')
            .filter((term) => term.length >= 2);
    }
    cleanObjectForSerialization(obj) {
        const seen = new WeakSet();
        const clean = (item) => {
            if (item === null || typeof item !== 'object') {
                return item;
            }
            if (seen.has(item)) {
                return '[Circular]';
            }
            seen.add(item);
            if (Array.isArray(item)) {
                return item.map(clean);
            }
            const cleaned = {};
            for (const [key, value] of Object.entries(item)) {
                if (key.startsWith('_') || key === '$__') {
                    continue;
                }
                cleaned[key] = clean(value);
            }
            return cleaned;
        };
        return clean(obj);
    }
    async monitorQuery(queryName, queryFn, slowQueryThreshold = 1000) {
        const startTime = Date.now();
        try {
            const result = await queryFn();
            const executionTime = Date.now() - startTime;
            if (executionTime > slowQueryThreshold) {
                console.warn(`Slow query detected: ${queryName} took ${executionTime}ms`);
            }
            return result;
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            console.error(`Query failed: ${queryName} after ${executionTime}ms`, error);
            throw error;
        }
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map