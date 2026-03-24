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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_filters_dto_1 = require("./dto/product-filters.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const combined_filter_service_1 = require("./services/combined-filter.service");
const products_events_service_1 = require("./products-events.service");
let ProductsController = class ProductsController {
    productsService;
    combinedFilterService;
    productsEventService;
    constructor(productsService, combinedFilterService, productsEventService) {
        this.productsService = productsService;
        this.combinedFilterService = combinedFilterService;
        this.productsEventService = productsEventService;
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    events() {
        return this.productsEventService
            .getEvents()
            .pipe((0, operators_1.map)((event) => ({ data: JSON.stringify(event) })));
    }
    findAll(filters) {
        return this.productsService.findAll(filters);
    }
    async findAllWithFilters(filters) {
        const result = await this.combinedFilterService.filterProducts({
            categories: filters.categories ? [filters.categories].flat() : undefined,
            search: filters.search,
            published: filters.published || 'true',
            page: filters.page || 1,
            limit: filters.limit || 20,
            inspiration: {
                styles: filters.styles ? [filters.styles].flat() : undefined,
                spaces: filters.spaces ? [filters.spaces].flat() : undefined,
            },
            technical: filters.technical_specs,
        });
        return result;
    }
    async findAllWithEnhancedFilters(query) {
        const filters = {
            categories: query.categories
                ? Array.isArray(query.categories)
                    ? query.categories
                    : [query.categories]
                : undefined,
            search: query.search,
            published: query.published || 'true',
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 20,
            inspiration: {
                styles: query.styles
                    ? Array.isArray(query.styles)
                        ? query.styles
                        : [query.styles]
                    : undefined,
                spaces: query.spaces
                    ? Array.isArray(query.spaces)
                        ? query.spaces
                        : [query.spaces]
                    : undefined,
            },
            technical: query.technical ? JSON.parse(query.technical) : undefined,
        };
        return this.combinedFilterService.filterProducts(filters);
    }
    async searchProducts(query) {
        const searchQuery = query.q || query.query || '';
        const filters = {
            categories: query.categories
                ? Array.isArray(query.categories)
                    ? query.categories
                    : [query.categories]
                : undefined,
            published: query.published || 'true',
        };
        const limit = query.limit ? parseInt(query.limit) : 20;
        const offset = query.offset ? parseInt(query.offset) : 0;
        return this.combinedFilterService.getSearchSuggestions(searchQuery, limit);
    }
    async getSearchSuggestions(query, limit) {
        const limitNum = limit ? parseInt(limit) : 10;
        return this.combinedFilterService.getSearchSuggestions(query, limitNum);
    }
    getPopularSearchTerms(limit) {
        const limitNum = limit ? parseInt(limit) : 10;
        return this.combinedFilterService.getPopularSearchTerms(limitNum);
    }
    async searchWithFilters(query) {
        const filters = {
            search: query.q || query.query,
            categories: query.categories
                ? Array.isArray(query.categories)
                    ? query.categories
                    : [query.categories]
                : undefined,
            published: query.published || 'true',
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 20,
            inspiration: {
                styles: query.styles
                    ? Array.isArray(query.styles)
                        ? query.styles
                        : [query.styles]
                    : undefined,
                spaces: query.spaces
                    ? Array.isArray(query.spaces)
                        ? query.spaces
                        : [query.spaces]
                    : undefined,
            },
            technical: query.technical ? JSON.parse(query.technical) : undefined,
        };
        return this.combinedFilterService.filterProductsWithSearch(filters);
    }
    async findAllWithOptimizedFilters(query) {
        const filters = {
            categories: query.categories
                ? Array.isArray(query.categories)
                    ? query.categories
                    : [query.categories]
                : undefined,
            search: query.search,
            published: query.published || 'true',
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 20,
            inspiration: {
                styles: query.styles
                    ? Array.isArray(query.styles)
                        ? query.styles
                        : [query.styles]
                    : undefined,
                spaces: query.spaces
                    ? Array.isArray(query.spaces)
                        ? query.spaces
                        : [query.spaces]
                    : undefined,
            },
            technical: query.technical ? JSON.parse(query.technical) : undefined,
        };
        return this.combinedFilterService.filterProductsOptimized(filters);
    }
    getCacheStats() {
        return this.combinedFilterService.getCacheStats();
    }
    clearCache(productId) {
        const deletedCount = this.combinedFilterService.clearProductCaches(productId);
        return { message: `Cleared ${deletedCount} cache entries` };
    }
    getFilterStatistics() {
        return this.combinedFilterService.getFilterStatistics();
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    async getGoldenRecord(id) {
        return this.productsService.getGoldenRecord(id);
    }
    findBySku(sku) {
        return this.productsService.findBySku(sku);
    }
    async getGoldenRecordBySku(sku) {
        return this.productsService.getGoldenRecordBySku(sku);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    updatePut(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    publish(id) {
        return this.productsService.publish(id);
    }
    unpublish(id) {
        return this.productsService.unpublish(id);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Sse)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "events", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_filters_dto_1.ProductFiltersDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filters'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_filters_dto_1.ProductFiltersDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllWithFilters", null);
__decorate([
    (0, common_1.Get)('filters/enhanced'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllWithEnhancedFilters", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('search/suggestions'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getSearchSuggestions", null);
__decorate([
    (0, common_1.Get)('search/popular'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getPopularSearchTerms", null);
__decorate([
    (0, common_1.Get)('filters/search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "searchWithFilters", null);
__decorate([
    (0, common_1.Get)('filters/optimized'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllWithOptimizedFilters", null);
__decorate([
    (0, common_1.Get)('cache/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCacheStats", null);
__decorate([
    (0, common_1.Delete)('cache'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Get)('filters/statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getFilterStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/golden-record'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getGoldenRecord", null);
__decorate([
    (0, common_1.Get)('sku/:sku'),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findBySku", null);
__decorate([
    (0, common_1.Get)('sku/:sku/golden-record'),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getGoldenRecordBySku", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updatePut", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/unpublish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        combined_filter_service_1.CombinedFilterService,
        products_events_service_1.ProductsEventService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map