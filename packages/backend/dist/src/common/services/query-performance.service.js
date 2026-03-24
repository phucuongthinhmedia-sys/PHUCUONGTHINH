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
var QueryPerformanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryPerformanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let QueryPerformanceService = QueryPerformanceService_1 = class QueryPerformanceService {
    prisma;
    logger = new common_1.Logger(QueryPerformanceService_1.name);
    performanceMetrics = [];
    maxMetricsHistory = 1000;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async executeWithMonitoring(query, params = [], options = {}) {
        const { enableAnalyze = true, enableBuffers = false, logSlowQueries = true, slowQueryThresholdMs = 100, } = options;
        const startTime = Date.now();
        let result = [];
        let queryPlan = null;
        let planningTime = 0;
        let executionTime = 0;
        try {
            if (enableAnalyze) {
                const explainQuery = `EXPLAIN (ANALYZE true, BUFFERS ${enableBuffers}, FORMAT JSON) ${query}`;
                const planResult = (await this.prisma.$queryRawUnsafe(explainQuery, ...params));
                queryPlan = planResult[0]?.['QUERY PLAN']?.[0];
                if (queryPlan) {
                    planningTime = queryPlan['Planning Time'] || 0;
                    executionTime = queryPlan['Execution Time'] || 0;
                }
            }
            result = await this.prisma.$queryRawUnsafe(query, ...params);
            const totalTime = Date.now() - startTime;
            const indexesUsed = this.extractIndexesFromPlan(queryPlan);
            const metrics = {
                query: this.sanitizeQuery(query),
                executionTimeMs: executionTime || totalTime,
                planningTimeMs: planningTime,
                executionTimeMs_actual: executionTime,
                totalTimeMs: totalTime,
                rowsReturned: Array.isArray(result) ? result.length : 0,
                indexesUsed,
                queryPlan: enableAnalyze ? queryPlan : undefined,
                timestamp: new Date(),
            };
            if (logSlowQueries && totalTime > slowQueryThresholdMs) {
                this.logger.warn(`Slow query detected (${totalTime}ms): ${this.sanitizeQuery(query)}`);
                this.logger.debug('Query plan:', JSON.stringify(queryPlan, null, 2));
            }
            this.storeMetrics(metrics);
            return { result, metrics };
        }
        catch (error) {
            const totalTime = Date.now() - startTime;
            this.logger.error(`Query execution failed (${totalTime}ms): ${this.sanitizeQuery(query)}`, error);
            throw error;
        }
    }
    async analyzeJsonbQueryPerformance(tableName, jsonbColumn, jsonbPath, filterValue) {
        const query = `
      SELECT * FROM "${tableName}" 
      WHERE "${jsonbColumn}"->>'${jsonbPath}' = $1
    `;
        const { metrics } = await this.executeWithMonitoring(query, [filterValue], {
            enableAnalyze: true,
            enableBuffers: true,
        });
        return metrics;
    }
    async validateJsonbIndexUsage(tableName, jsonbColumn, operation, testValue) {
        let query;
        let params;
        switch (operation) {
            case 'containment':
                query = `SELECT * FROM "${tableName}" WHERE "${jsonbColumn}" @> $1`;
                params = [JSON.stringify(testValue)];
                break;
            case 'path':
                query = `SELECT * FROM "${tableName}" WHERE "${jsonbColumn}"->>'${Object.keys(testValue)[0]}' = $1`;
                params = [Object.values(testValue)[0]];
                break;
            case 'existence':
                query = `SELECT * FROM "${tableName}" WHERE "${jsonbColumn}" ? $1`;
                params = [Object.keys(testValue)[0]];
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
        const { metrics } = await this.executeWithMonitoring(query, params, {
            enableAnalyze: true,
        });
        const indexUsed = metrics.indexesUsed.length > 0;
        const indexName = metrics.indexesUsed.find((idx) => idx.includes('gin')) ||
            metrics.indexesUsed[0];
        return {
            indexUsed,
            indexName,
            metrics,
        };
    }
    getQueryPatternStats(queryPattern) {
        const matchingMetrics = this.performanceMetrics.filter((m) => m.query.includes(queryPattern));
        if (matchingMetrics.length === 0) {
            return {
                count: 0,
                avgExecutionTime: 0,
                minExecutionTime: 0,
                maxExecutionTime: 0,
                avgRowsReturned: 0,
                indexUsageRate: 0,
            };
        }
        const executionTimes = matchingMetrics.map((m) => m.executionTimeMs);
        const rowCounts = matchingMetrics.map((m) => m.rowsReturned);
        const indexUsageCount = matchingMetrics.filter((m) => m.indexesUsed.length > 0).length;
        return {
            count: matchingMetrics.length,
            avgExecutionTime: executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length,
            minExecutionTime: Math.min(...executionTimes),
            maxExecutionTime: Math.max(...executionTimes),
            avgRowsReturned: rowCounts.reduce((a, b) => a + b, 0) / rowCounts.length,
            indexUsageRate: (indexUsageCount / matchingMetrics.length) * 100,
        };
    }
    getRecentMetrics(limit = 50) {
        return this.performanceMetrics
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    getSlowQueries(thresholdMs = 100) {
        return this.performanceMetrics
            .filter((m) => m.executionTimeMs > thresholdMs)
            .sort((a, b) => b.executionTimeMs - a.executionTimeMs);
    }
    clearMetrics() {
        this.performanceMetrics = [];
    }
    extractIndexesFromPlan(queryPlan) {
        if (!queryPlan)
            return [];
        const indexes = [];
        const extractFromNode = (node) => {
            if (node['Index Name']) {
                indexes.push(node['Index Name']);
            }
            if (node.Plans) {
                node.Plans.forEach(extractFromNode);
            }
        };
        if (queryPlan.Plan) {
            extractFromNode(queryPlan.Plan);
        }
        return Array.from(new Set(indexes));
    }
    sanitizeQuery(query) {
        return query
            .replace(/\$\d+/g, '?')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200);
    }
    storeMetrics(metrics) {
        this.performanceMetrics.push(metrics);
        if (this.performanceMetrics.length > this.maxMetricsHistory) {
            this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetricsHistory);
        }
    }
};
exports.QueryPerformanceService = QueryPerformanceService;
exports.QueryPerformanceService = QueryPerformanceService = QueryPerformanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueryPerformanceService);
//# sourceMappingURL=query-performance.service.js.map