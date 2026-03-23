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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchProducts(searchQuery, filters = {}, limit = 20, offset = 0) {
        if (!searchQuery || searchQuery.trim().length === 0) {
            return {
                products: [],
                total: 0,
                query: searchQuery,
            };
        }
        const normalizedQuery = this.normalizeSearchQuery(searchQuery);
        const searchTerms = this.extractSearchTerms(normalizedQuery);
        const baseWhere = this.buildBaseWhere(filters);
        const searchConditions = this.buildSearchConditions(searchTerms);
        const finalWhere = {
            ...baseWhere,
            AND: [...(baseWhere.AND || []), { OR: searchConditions }],
        };
        const [products, total] = await Promise.all([
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
                        where: { is_cover: true },
                        take: 1,
                    },
                },
                skip: offset,
                take: limit,
            }),
            this.prisma.product.count({ where: finalWhere }),
        ]);
        const productsWithRelevance = products.map((product) => {
            const relevanceData = this.calculateRelevanceScore(product, searchTerms);
            return {
                ...product,
                technical_specs: this.parseJsonSafely(product.technical_specs),
                relevance_score: relevanceData.score,
                match_fields: relevanceData.matchFields,
            };
        });
        productsWithRelevance.sort((a, b) => b.relevance_score - a.relevance_score);
        return {
            products: productsWithRelevance,
            total,
            query: searchQuery,
            search_terms: searchTerms,
        };
    }
    async getSearchSuggestions(partialQuery, limit = 10) {
        if (!partialQuery || partialQuery.trim().length < 2) {
            return [];
        }
        const normalizedQuery = this.normalizeSearchQuery(partialQuery);
        const suggestions = await this.prisma.product.findMany({
            where: {
                is_published: true,
                OR: [
                    { name: { contains: normalizedQuery } },
                    { sku: { contains: normalizedQuery } },
                ],
            },
            select: {
                name: true,
                sku: true,
            },
            take: limit * 2,
        });
        const uniqueSuggestions = new Set();
        suggestions.forEach((product) => {
            if (product.name.toLowerCase().includes(normalizedQuery.toLowerCase())) {
                uniqueSuggestions.add(product.name);
            }
            if (product.sku.toLowerCase().includes(normalizedQuery.toLowerCase())) {
                uniqueSuggestions.add(product.sku);
            }
        });
        return Array.from(uniqueSuggestions)
            .slice(0, limit)
            .sort((a, b) => a.length - b.length);
    }
    async getPopularSearchTerms(limit = 10) {
        return [
            'tile',
            'porcelain',
            'ceramic',
            'bathroom',
            'kitchen',
            'floor',
            'wall',
            'mosaic',
            'marble',
            'granite',
        ].slice(0, limit);
    }
    normalizeSearchQuery(query) {
        return query
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, ' ')
            .replace(/\s+/g, ' ');
    }
    extractSearchTerms(normalizedQuery) {
        return normalizedQuery
            .split(' ')
            .filter((term) => term.length > 0)
            .filter((term) => term.length >= 2);
    }
    buildBaseWhere(filters) {
        const where = {};
        if (filters.published === 'true') {
            where.is_published = true;
        }
        else if (filters.published === 'false') {
            where.is_published = false;
        }
        if (filters.categories && filters.categories.length > 0) {
            where.category_id = { in: filters.categories };
        }
        return where;
    }
    buildSearchConditions(searchTerms) {
        const conditions = [];
        searchTerms.forEach((term) => {
            conditions.push({ name: { contains: term } });
            conditions.push({ sku: { contains: term } });
            conditions.push({ description: { contains: term } });
            conditions.push({
                technical_specs: { contains: term },
            });
        });
        return conditions;
    }
    calculateRelevanceScore(product, searchTerms) {
        let score = 0;
        const matchFields = [];
        const productName = (product.name || '').toLowerCase();
        const productSku = (product.sku || '').toLowerCase();
        const productDescription = (product.description || '').toLowerCase();
        const productTechnicalSpecs = (product.technical_specs || '').toLowerCase();
        searchTerms.forEach((term) => {
            const lowerTerm = term.toLowerCase();
            if (productName === lowerTerm) {
                score += 100;
                matchFields.push('name_exact');
            }
            else if (productName.includes(lowerTerm)) {
                if (productName.startsWith(lowerTerm)) {
                    score += 50;
                    matchFields.push('name_prefix');
                }
                else {
                    score += 25;
                    matchFields.push('name_contains');
                }
            }
            if (productSku === lowerTerm) {
                score += 80;
                matchFields.push('sku_exact');
            }
            else if (productSku.includes(lowerTerm)) {
                score += 40;
                matchFields.push('sku_contains');
            }
            if (productDescription.includes(lowerTerm)) {
                score += 15;
                matchFields.push('description');
            }
            if (productTechnicalSpecs.includes(lowerTerm)) {
                score += 10;
                matchFields.push('technical_specs');
            }
        });
        const uniqueMatchFields = [...new Set(matchFields)];
        score += uniqueMatchFields.length * 5;
        return {
            score,
            matchFields: uniqueMatchFields,
        };
    }
    parseJsonSafely(jsonString) {
        try {
            return JSON.parse(jsonString);
        }
        catch {
            return {};
        }
    }
    async searchWithFilters(searchQuery, inspirationFilters, technicalFilters, baseFilters, pagination) {
        const { page = 1, limit = 20 } = pagination || {};
        const offset = (page - 1) * limit;
        if (!searchQuery || searchQuery.trim().length === 0) {
            return {
                products: [],
                total: 0,
                pagination: { page, limit, total: 0, total_pages: 0 },
                query: searchQuery,
            };
        }
        const normalizedQuery = this.normalizeSearchQuery(searchQuery);
        const searchTerms = this.extractSearchTerms(normalizedQuery);
        const whereConditions = [];
        const baseWhere = this.buildBaseWhere(baseFilters || {});
        if (Object.keys(baseWhere).length > 0) {
            whereConditions.push(baseWhere);
        }
        const searchConditions = this.buildSearchConditions(searchTerms);
        whereConditions.push({ OR: searchConditions });
        if (inspirationFilters) {
            if (inspirationFilters.styles && inspirationFilters.styles.length > 0) {
                whereConditions.push({
                    style_tags: {
                        some: {
                            style_id: { in: inspirationFilters.styles },
                        },
                    },
                });
            }
            if (inspirationFilters.spaces && inspirationFilters.spaces.length > 0) {
                whereConditions.push({
                    space_tags: {
                        some: {
                            space_id: { in: inspirationFilters.spaces },
                        },
                    },
                });
            }
        }
        if (technicalFilters && Object.keys(technicalFilters).length > 0) {
            const techConditions = Object.entries(technicalFilters).map(([key, value]) => ({
                technical_specs: {
                    contains: `"${key}":"${value}"`,
                },
            }));
            whereConditions.push({ AND: techConditions });
        }
        const finalWhere = whereConditions.length > 1
            ? { AND: whereConditions }
            : whereConditions[0] || {};
        const [products, total] = await Promise.all([
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
                skip: offset,
                take: limit,
            }),
            this.prisma.product.count({ where: finalWhere }),
        ]);
        const productsWithRelevance = products.map((product) => {
            const relevanceData = this.calculateRelevanceScore(product, searchTerms);
            return {
                ...product,
                technical_specs: this.parseJsonSafely(product.technical_specs),
                relevance_score: relevanceData.score,
                match_fields: relevanceData.matchFields,
            };
        });
        productsWithRelevance.sort((a, b) => b.relevance_score - a.relevance_score);
        return {
            products: productsWithRelevance,
            total,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit),
            },
            query: searchQuery,
            search_terms: searchTerms,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map