import { DatabaseOptimizationService } from '../services/database-optimization.service';
import { CdnCachingService } from '../services/cdn-caching.service';
import { CacheService } from '../services/cache.service';
export declare class PerformanceController {
    private dbOptimization;
    private cdnCaching;
    private cache;
    constructor(dbOptimization: DatabaseOptimizationService, cdnCaching: CdnCachingService, cache: CacheService);
    getDatabaseOptimization(): {
        products: any;
        leads: any;
        media: any;
        general: string[];
    };
    getCdnStrategy(): {
        cacheHeaders: {
            'Cache-Control': string;
            'Content-Type': string;
            'CDN-Cache-Control'?: string;
        };
        apiCacheStrategy: {
            products: string;
            categories: string;
            tags: string;
            media: string;
            leads: string;
        };
        optimizationRecommendations: string[];
        purgeConfiguration: {
            strategy: string;
            ttl: number;
            patterns: string[];
        };
    };
    getCacheStats(): {
        size: number;
        keys: string[];
    };
    getConnectionPoolStats(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
