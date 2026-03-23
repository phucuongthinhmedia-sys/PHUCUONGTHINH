"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const global_exception_filter_1 = require("./filters/global-exception.filter");
const response_interceptor_1 = require("./interceptors/response.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
const logger_service_1 = require("./services/logger.service");
const cache_service_1 = require("./services/cache.service");
const database_optimization_service_1 = require("./services/database-optimization.service");
const cdn_caching_service_1 = require("./services/cdn-caching.service");
const rate_limiter_service_1 = require("./services/rate-limiter.service");
const security_headers_service_1 = require("./services/security-headers.service");
const query_performance_service_1 = require("./services/query-performance.service");
const performance_controller_1 = require("./controllers/performance.controller");
const security_controller_1 = require("./controllers/security.controller");
const query_performance_controller_1 = require("./controllers/query-performance.controller");
const security_headers_middleware_1 = require("./middleware/security-headers.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const prisma_module_1 = require("../prisma/prisma.module");
let CommonModule = class CommonModule {
    configure(consumer) {
        consumer
            .apply(security_headers_middleware_1.SecurityHeadersMiddleware, rate_limit_middleware_1.RateLimitMiddleware)
            .forRoutes('*');
    }
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [
            performance_controller_1.PerformanceController,
            security_controller_1.SecurityController,
            query_performance_controller_1.QueryPerformanceController,
        ],
        providers: [
            logger_service_1.LoggerService,
            cache_service_1.CacheService,
            database_optimization_service_1.DatabaseOptimizationService,
            cdn_caching_service_1.CdnCachingService,
            rate_limiter_service_1.RateLimiterService,
            security_headers_service_1.SecurityHeadersService,
            query_performance_service_1.QueryPerformanceService,
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
        ],
        exports: [
            logger_service_1.LoggerService,
            cache_service_1.CacheService,
            database_optimization_service_1.DatabaseOptimizationService,
            cdn_caching_service_1.CdnCachingService,
            rate_limiter_service_1.RateLimiterService,
            security_headers_service_1.SecurityHeadersService,
            query_performance_service_1.QueryPerformanceService,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map