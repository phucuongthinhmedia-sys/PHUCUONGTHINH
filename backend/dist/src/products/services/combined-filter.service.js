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
exports.CombinedFilterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const categories_service_1 = require("../../categories/categories.service");
const inspiration_filter_service_1 = require("./inspiration-filter.service");
const technical_filter_service_1 = require("./technical-filter.service");
const search_service_1 = require("./search.service");
const pagination_service_1 = require("./pagination.service");
const cache_service_1 = require("./cache.service");
const performance_service_1 = require("./performance.service");
let CombinedFilterService = class CombinedFilterService {
    prisma;
    categoriesService;
    inspirationFilterService;
    technicalFilterService;
    searchService;
    paginationService;
    cacheService;
    performanceService;
    constructor(prisma, categoriesService, inspirationFilterService, technicalFilterService, searchService, paginationService, cacheService, performanceService) {
        this.prisma = prisma;
        this.categoriesService = categoriesService;
        this.inspirationFilterService = inspirationFilterService;
        this.technicalFilterService = technicalFilterService;
        this.searchService = searchService;
        this.paginationService = paginationService;
        this.cacheService = cacheService;
        this.performanceService = performanceService;
    }
    async filterProducts(filters) {
        const { categories, search, published = 'true', inspiration, technical, page = 1, limit = 20, } = filters;
        const skip = (page - 1) * limit;
        const baseWhere = {};
        if (published === 'true') {
            baseWhere.is_published = true;
        }
        else if (published === 'false') {
            baseWhere.is_published = false;
        }
        if (categories && categories.length > 0) {
            const categoryIds = new Set();
            for (const categoryId of categories) {
                try {
                    const hierarchy = await this.categoriesService.findHierarchy(categoryId);
                    hierarchy.forEach((cat) => categoryIds.add(cat.id));
                }
                catch {
                    categoryIds.add(categoryId);
                }
            }
            baseWhere.category_id = { in: Array.from(categoryIds) };
        }
        if (search) {
            baseWhere.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const whereConditions = [];
        if (Object.keys(baseWhere).length > 0) {
            whereConditions.push(baseWhere);
        }
        if (inspiration) {
            const inspirationWhere = this.inspirationFilterService.buildInspirationWhere(inspiration);
            if (Object.keys(inspirationWhere).length > 0) {
                whereConditions.push(inspirationWhere);
            }
        }
        if (technical) {
            if (!this.technicalFilterService.validateTechnicalFilters(technical)) {
                throw new Error('Invalid technical filters');
            }
            const technicalWhere = this.technicalFilterService.buildTechnicalWhere(technical);
            if (Object.keys(technicalWhere).length > 0) {
                whereConditions.push(technicalWhere);
            }
        }
        const finalWhere = whereConditions.length > 0
            ? whereConditions.length === 1
                ? whereConditions[0]
                : { AND: whereConditions }
            : {};
        const [products, total, availableFilters] = await Promise.all([
            this.prisma.product.findMany({
                where: finalWhere,
                include: {
                    category: true,
                    style_tags: {
                        include: {
                            style: true,
                        },
                    },
                    space_tags: {
                        include: {
                            space: true,
                        },
                    },
                    media: {
                        orderBy: {
                            sort_order: 'asc',
                        },
                    },
                },
                orderBy: [
                    { is_published: 'desc' },
                    { created_at: 'desc' },
                ],
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where: finalWhere }),
            this.getAvailableFilters(baseWhere),
        ]);
        const productsWithParsedSpecs = products.map((product) => ({
            ...product,
            technical_specs: this.parseJsonSafely(product.technical_specs),
        }));
        return {
            products: productsWithParsedSpecs,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit),
            },
            available_filters: availableFilters,
        };
    }
    async getAvailableFilters(baseWhere = {}) {
        const [inspirationFilters, technicalFilters, categories] = await Promise.all([
            this.inspirationFilterService.getAvailableFilters(),
            this.technicalFilterService.getAvailableTechnicalFilters(baseWhere),
            this.prisma.category.findMany({
                orderBy: { name: 'asc' },
            }),
        ]);
        return {
            inspiration: inspirationFilters,
            technical: {
                ...technicalFilters,
                ...this.technicalFilterService.getCommonTechnicalFields(),
            },
            categories,
        };
    }
    async getAvailableFiltersCached() {
        return this.cacheService.cached('available_filters', () => this.getAvailableFilters({}), { ttl: 600 });
    }
    async filterProductsOptimized(filters) {
        const { categories, search, published = 'true', inspiration, technical, page = 1, limit = 20, } = filters;
        const paginationValidation = this.paginationService.validatePaginationOptions({ page, limit });
        if (!paginationValidation.isValid) {
            throw new Error(`Invalid pagination: ${paginationValidation.errors.join(', ')}`);
        }
        const cacheKey = this.cacheService.generateFilterCacheKey(filters);
        const cachedResult = this.cacheService.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        const queryConfig = this.performanceService.buildOptimizedProductQuery(filters);
        const pagination = this.paginationService.calculatePagination(0, {
            page,
            limit,
        });
        const result = await this.performanceService.monitorQuery('filterProducts', async () => {
            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    where: queryConfig.where,
                    include: queryConfig.include,
                    orderBy: queryConfig.orderBy,
                    skip: pagination.offset,
                    take: pagination.limit,
                }),
                this.prisma.product.count({ where: queryConfig.where }),
            ]);
            return { products, total };
        });
        const finalPagination = this.paginationService.calculatePagination(result.total, { page, limit });
        const availableFilters = await this.getAvailableFiltersCached();
        const optimizedProducts = this.performanceService.optimizeResultSerialization(result.products.map((product) => ({
            ...product,
            technical_specs: this.parseJsonSafely(product.technical_specs),
        })));
        const response = {
            products: optimizedProducts,
            pagination: finalPagination,
            available_filters: availableFilters,
        };
        this.cacheService.set(cacheKey, response, { ttl: 300 });
        return response;
    }
    clearProductCaches(productId) {
        return this.cacheService.invalidateProductCache(productId);
    }
    getCacheStats() {
        return this.cacheService.getStats();
    }
    parseJsonSafely(jsonString) {
        try {
            return JSON.parse(jsonString);
        }
        catch {
            return {};
        }
    }
    async filterProductsWithSearch(filters) {
        const { search, ...otherFilters } = filters;
        if (search && search.trim().length > 0) {
            const result = await this.searchService.searchWithFilters(search, otherFilters.inspiration, otherFilters.technical, {
                categories: otherFilters.categories,
                published: otherFilters.published,
            }, {
                page: otherFilters.page || 1,
                limit: otherFilters.limit || 20,
            });
            const availableFilters = await this.getAvailableFilters({});
            return {
                ...result,
                available_filters: availableFilters,
            };
        }
        return this.filterProducts(filters);
    }
    async getSearchSuggestions(query, limit = 10) {
        return this.searchService.getSearchSuggestions(query, limit);
    }
    async getPopularSearchTerms(limit = 10) {
        return this.searchService.getPopularSearchTerms(limit);
    }
    async getFilterStatistics() {
        const [totalProducts, publishedProducts, categoryCounts] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { is_published: true } }),
            this.prisma.category.findMany({
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            }),
        ]);
        return {
            total_products: totalProducts,
            published_products: publishedProducts,
            unpublished_products: totalProducts - publishedProducts,
            category_distribution: categoryCounts.map((cat) => ({
                category: cat.name,
                count: cat._count.products,
            })),
        };
    }
};
exports.CombinedFilterService = CombinedFilterService;
exports.CombinedFilterService = CombinedFilterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        categories_service_1.CategoriesService,
        inspiration_filter_service_1.InspirationFilterService,
        technical_filter_service_1.TechnicalFilterService,
        search_service_1.SearchService,
        pagination_service_1.PaginationService,
        cache_service_1.CacheService,
        performance_service_1.PerformanceService])
], CombinedFilterService);
//# sourceMappingURL=combined-filter.service.js.map