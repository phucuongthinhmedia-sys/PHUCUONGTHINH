import { PrismaService } from '../../prisma/prisma.service';
export interface QueryOptimizationOptions {
    enableIndexHints?: boolean;
    batchSize?: number;
    maxQueryTime?: number;
}
export interface PerformanceMetrics {
    queryTime: number;
    resultCount: number;
    cacheHit: boolean;
    indexesUsed: string[];
    optimizationApplied: string[];
}
export declare class PerformanceService {
    private prisma;
    constructor(prisma: PrismaService);
    optimizeQuery<T>(queryFn: () => Promise<T>, options?: QueryOptimizationOptions): Promise<{
        result: T;
        metrics: PerformanceMetrics;
    }>;
    buildOptimizedProductQuery(filters: any): {
        where: any;
        include: any;
        orderBy: any;
        optimizations: string[];
    };
    processBatches<T, R>(items: T[], batchSize: number, processor: (batch: T[]) => Promise<R[]>): Promise<R[]>;
    analyzeQueryPerformance(queryName: string, queryFn: () => Promise<any>): Promise<{
        queryName: string;
        executionTime: number;
        resultSize: number;
        recommendations: string[];
    }>;
    getConnectionPoolStats(): Promise<{
        activeConnections: number;
        idleConnections: number;
        totalConnections: number;
        recommendations: string[];
    }>;
    optimizeResultSerialization<T>(data: T[]): T[];
    private extractSearchTerms;
    private cleanObjectForSerialization;
    monitorQuery<T>(queryName: string, queryFn: () => Promise<T>, slowQueryThreshold?: number): Promise<T>;
}
