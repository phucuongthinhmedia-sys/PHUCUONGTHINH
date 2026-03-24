"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const prisma_module_1 = require("../prisma/prisma.module");
const categories_module_1 = require("../categories/categories.module");
const inspiration_filter_service_1 = require("./services/inspiration-filter.service");
const technical_filter_service_1 = require("./services/technical-filter.service");
const combined_filter_service_1 = require("./services/combined-filter.service");
const search_service_1 = require("./services/search.service");
const pagination_service_1 = require("./services/pagination.service");
const cache_service_1 = require("./services/cache.service");
const performance_service_1 = require("./services/performance.service");
const products_events_service_1 = require("./products-events.service");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, categories_module_1.CategoriesModule],
        controllers: [products_controller_1.ProductsController],
        providers: [
            products_service_1.ProductsService,
            products_events_service_1.ProductsEventService,
            inspiration_filter_service_1.InspirationFilterService,
            technical_filter_service_1.TechnicalFilterService,
            combined_filter_service_1.CombinedFilterService,
            search_service_1.SearchService,
            pagination_service_1.PaginationService,
            cache_service_1.CacheService,
            performance_service_1.PerformanceService,
        ],
        exports: [products_service_1.ProductsService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map