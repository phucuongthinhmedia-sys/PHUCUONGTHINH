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
exports.PerformanceController = void 0;
const common_1 = require("@nestjs/common");
const database_optimization_service_1 = require("../services/database-optimization.service");
const cdn_caching_service_1 = require("../services/cdn-caching.service");
const cache_service_1 = require("../services/cache.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PerformanceController = class PerformanceController {
    dbOptimization;
    cdnCaching;
    cache;
    constructor(dbOptimization, cdnCaching, cache) {
        this.dbOptimization = dbOptimization;
        this.cdnCaching = cdnCaching;
        this.cache = cache;
    }
    getDatabaseOptimization() {
        return this.dbOptimization.getOptimizationReport();
    }
    getCdnStrategy() {
        return {
            cacheHeaders: this.cdnCaching.getCacheHeaders('lifestyle'),
            apiCacheStrategy: this.cdnCaching.getApiCacheStrategy(),
            optimizationRecommendations: this.cdnCaching.getOptimizationRecommendations(),
            purgeConfiguration: this.cdnCaching.getPurgeConfiguration(),
        };
    }
    getCacheStats() {
        return this.cache.getStats();
    }
    async getConnectionPoolStats() {
        return this.dbOptimization.getConnectionPoolStats();
    }
};
exports.PerformanceController = PerformanceController;
__decorate([
    (0, common_1.Get)('database-optimization'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerformanceController.prototype, "getDatabaseOptimization", null);
__decorate([
    (0, common_1.Get)('cdn-strategy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerformanceController.prototype, "getCdnStrategy", null);
__decorate([
    (0, common_1.Get)('cache-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerformanceController.prototype, "getCacheStats", null);
__decorate([
    (0, common_1.Get)('connection-pool'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getConnectionPoolStats", null);
exports.PerformanceController = PerformanceController = __decorate([
    (0, common_1.Controller)('performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [database_optimization_service_1.DatabaseOptimizationService,
        cdn_caching_service_1.CdnCachingService,
        cache_service_1.CacheService])
], PerformanceController);
//# sourceMappingURL=performance.controller.js.map