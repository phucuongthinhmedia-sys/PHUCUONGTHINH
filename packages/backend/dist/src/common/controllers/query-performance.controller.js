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
exports.QueryPerformanceController = void 0;
const common_1 = require("@nestjs/common");
const query_performance_service_1 = require("../services/query-performance.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
let QueryPerformanceController = class QueryPerformanceController {
    performanceService;
    constructor(performanceService) {
        this.performanceService = performanceService;
    }
    async getRecentMetrics(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        return this.performanceService.getRecentMetrics(limitNum);
    }
    async getSlowQueries(threshold) {
        const thresholdMs = threshold ? parseInt(threshold, 10) : 100;
        return this.performanceService.getSlowQueries(thresholdMs);
    }
    async getQueryPatternStats(pattern) {
        if (!pattern) {
            throw new Error('Query pattern is required');
        }
        const stats = this.performanceService.getQueryPatternStats(pattern);
        return {
            pattern,
            ...stats,
        };
    }
    async testJsonbPerformance(request) {
        const { tableName, jsonbColumn, operation, testValue } = request;
        const result = await this.performanceService.validateJsonbIndexUsage(tableName, jsonbColumn, operation, testValue);
        const recommendations = [];
        if (!result.indexUsed) {
            recommendations.push(`Consider adding a GIN index on ${tableName}.${jsonbColumn}`);
        }
        if (result.metrics.executionTimeMs > 100) {
            recommendations.push('Query execution time is high, consider optimizing the query or adding more specific indexes');
        }
        if (result.metrics.rowsReturned > 1000 &&
            result.metrics.executionTimeMs > 50) {
            recommendations.push('Large result set with slow execution, consider adding LIMIT or more selective WHERE conditions');
        }
        return {
            ...result,
            recommendations: recommendations.length > 0 ? recommendations : undefined,
        };
    }
    async analyzeJsonbPatterns() {
        const patterns = [
            {
                pattern: 'technical_data_material',
                description: 'Filter by technical_data.material',
                testValue: { material: 'ceramic' },
            },
            {
                pattern: 'marketing_content_target_spaces',
                description: 'Filter by marketing_content.target_spaces',
                testValue: { target_spaces: ['bathroom'] },
            },
            {
                pattern: 'relational_data_color_variants',
                description: 'Filter by relational_data.color_variants',
                testValue: { color_variants: ['white', 'black'] },
            },
            {
                pattern: 'ai_semantic_layer_tags',
                description: 'Filter by ai_semantic_layer.auto_generated_tags',
                testValue: { auto_generated_tags: ['modern', 'luxury'] },
            },
        ];
        const results = [];
        let totalExecutionTime = 0;
        let indexUsageCount = 0;
        for (const pattern of patterns) {
            try {
                const result = await this.performanceService.validateJsonbIndexUsage('products', pattern.pattern.split('_')[0] + '_' + pattern.pattern.split('_')[1], 'containment', pattern.testValue);
                results.push({
                    pattern: pattern.pattern,
                    description: pattern.description,
                    metrics: result.metrics,
                    indexUsed: result.indexUsed,
                });
                totalExecutionTime += result.metrics.executionTimeMs;
                if (result.indexUsed)
                    indexUsageCount++;
            }
            catch (error) {
                continue;
            }
        }
        return {
            patterns: results,
            summary: {
                totalPatterns: results.length,
                avgExecutionTime: results.length > 0 ? totalExecutionTime / results.length : 0,
                indexUsageRate: results.length > 0 ? (indexUsageCount / results.length) * 100 : 0,
            },
        };
    }
    async clearMetrics() {
        this.performanceService.clearMetrics();
        return { message: 'Performance metrics cleared successfully' };
    }
    async getDatabaseIndexes(tableName) {
        const query = tableName
            ? `
        SELECT 
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1
        ORDER BY tablename, indexname
      `
            : `
        SELECT 
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE schemaname = 'public'
        ORDER BY tablename, indexname
      `;
        const params = tableName ? [tableName] : [];
        const { result } = await this.performanceService.executeWithMonitoring(query, params, { enableAnalyze: false });
        return result.map((row) => ({
            tableName: row.tablename,
            indexName: row.indexname,
            indexType: this.extractIndexType(row.indexdef),
            columns: this.extractIndexColumns(row.indexdef),
            isUnique: row.indexdef.includes('UNIQUE'),
            size: undefined,
        }));
    }
    extractIndexType(indexDef) {
        if (indexDef.includes('USING gin'))
            return 'GIN';
        if (indexDef.includes('USING btree'))
            return 'BTREE';
        if (indexDef.includes('USING hash'))
            return 'HASH';
        if (indexDef.includes('USING gist'))
            return 'GIST';
        return 'BTREE';
    }
    extractIndexColumns(indexDef) {
        const match = indexDef.match(/\((.*?)\)/);
        if (!match)
            return [];
        return match[1]
            .split(',')
            .map((col) => col.trim().replace(/"/g, ''))
            .filter((col) => col.length > 0);
    }
};
exports.QueryPerformanceController = QueryPerformanceController;
__decorate([
    (0, common_1.Get)('metrics'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "getRecentMetrics", null);
__decorate([
    (0, common_1.Get)('slow-queries'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "getSlowQueries", null);
__decorate([
    (0, common_1.Get)('pattern-stats'),
    __param(0, (0, common_1.Query)('pattern')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "getQueryPatternStats", null);
__decorate([
    (0, common_1.Post)('test-jsonb'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "testJsonbPerformance", null);
__decorate([
    (0, common_1.Post)('analyze-jsonb-patterns'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "analyzeJsonbPatterns", null);
__decorate([
    (0, common_1.Post)('clear-metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "clearMetrics", null);
__decorate([
    (0, common_1.Get)('indexes'),
    __param(0, (0, common_1.Query)('table')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QueryPerformanceController.prototype, "getDatabaseIndexes", null);
exports.QueryPerformanceController = QueryPerformanceController = __decorate([
    (0, common_1.Controller)('api/performance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [query_performance_service_1.QueryPerformanceService])
], QueryPerformanceController);
//# sourceMappingURL=query-performance.controller.js.map