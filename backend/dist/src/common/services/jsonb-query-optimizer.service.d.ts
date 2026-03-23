export interface JsonbQueryOptimization {
    originalQuery: string;
    optimizedQuery: string;
    indexRecommendations: string[];
    estimatedPerformanceGain: number;
}
export declare class JsonbQueryOptimizerService {
    private readonly logger;
    optimizeJsonbQuery(tableName: string, jsonbColumn: string, operation: string, path?: string): JsonbQueryOptimization;
    private optimizeContainmentQuery;
    private optimizePathQuery;
    private optimizeExistenceQuery;
}
