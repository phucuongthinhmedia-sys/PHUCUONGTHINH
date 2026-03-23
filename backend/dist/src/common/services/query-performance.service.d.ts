import { PrismaService } from '../../prisma/prisma.service';
export interface QueryPerformanceMetrics {
    query: string;
    executionTimeMs: number;
    planningTimeMs?: number;
    executionTimeMs_actual?: number;
    totalTimeMs: number;
    rowsReturned: number;
    indexesUsed: string[];
    queryPlan?: any;
    timestamp: Date;
}
export interface QueryPlanNode {
    'Node Type': string;
    'Relation Name'?: string;
    'Index Name'?: string;
    'Startup Cost': number;
    'Total Cost': number;
    'Plan Rows': number;
    'Plan Width': number;
    'Actual Startup Time'?: number;
    'Actual Total Time'?: number;
    'Actual Rows'?: number;
    Plans?: QueryPlanNode[];
}
export declare class QueryPerformanceService {
    private prisma;
    private readonly logger;
    private performanceMetrics;
    private readonly maxMetricsHistory;
    constructor(prisma: PrismaService);
    executeWithMonitoring<T>(query: string, params?: any[], options?: {
        enableAnalyze?: boolean;
        enableBuffers?: boolean;
        logSlowQueries?: boolean;
        slowQueryThresholdMs?: number;
    }): Promise<{
        result: T[];
        metrics: QueryPerformanceMetrics;
    }>;
    analyzeJsonbQueryPerformance(tableName: string, jsonbColumn: string, jsonbPath: string, filterValue: any): Promise<QueryPerformanceMetrics>;
    validateJsonbIndexUsage(tableName: string, jsonbColumn: string, operation: 'containment' | 'path' | 'existence', testValue: any): Promise<{
        indexUsed: boolean;
        indexName?: string;
        metrics: QueryPerformanceMetrics;
    }>;
    getQueryPatternStats(queryPattern: string): {
        count: number;
        avgExecutionTime: number;
        minExecutionTime: number;
        maxExecutionTime: number;
        avgRowsReturned: number;
        indexUsageRate: number;
    };
    getRecentMetrics(limit?: number): QueryPerformanceMetrics[];
    getSlowQueries(thresholdMs?: number): QueryPerformanceMetrics[];
    clearMetrics(): void;
    private extractIndexesFromPlan;
    private sanitizeQuery;
    private storeMetrics;
}
