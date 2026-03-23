import { QueryPerformanceService, QueryPerformanceMetrics } from '../services/query-performance.service';
export interface JsonbPerformanceTestRequest {
    tableName: string;
    jsonbColumn: string;
    operation: 'containment' | 'path' | 'existence';
    testValue: any;
}
export interface QueryPatternStatsResponse {
    pattern: string;
    count: number;
    avgExecutionTime: number;
    minExecutionTime: number;
    maxExecutionTime: number;
    avgRowsReturned: number;
    indexUsageRate: number;
}
export declare class QueryPerformanceController {
    private readonly performanceService;
    constructor(performanceService: QueryPerformanceService);
    getRecentMetrics(limit?: string): Promise<QueryPerformanceMetrics[]>;
    getSlowQueries(threshold?: string): Promise<QueryPerformanceMetrics[]>;
    getQueryPatternStats(pattern: string): Promise<QueryPatternStatsResponse>;
    testJsonbPerformance(request: JsonbPerformanceTestRequest): Promise<{
        indexUsed: boolean;
        indexName?: string;
        metrics: QueryPerformanceMetrics;
        recommendations?: string[];
    }>;
    analyzeJsonbPatterns(): Promise<{
        patterns: Array<{
            pattern: string;
            description: string;
            metrics: QueryPerformanceMetrics;
            indexUsed: boolean;
        }>;
        summary: {
            totalPatterns: number;
            avgExecutionTime: number;
            indexUsageRate: number;
        };
    }>;
    clearMetrics(): Promise<{
        message: string;
    }>;
    getDatabaseIndexes(tableName?: string): Promise<Array<{
        tableName: string;
        indexName: string;
        indexType: string;
        columns: string[];
        isUnique: boolean;
        size?: string;
    }>>;
    private extractIndexType;
    private extractIndexColumns;
}
