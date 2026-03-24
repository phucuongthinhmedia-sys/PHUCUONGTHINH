export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (req: any) => string;
}
export declare class RateLimiterService {
    private limits;
    private cleanupInterval;
    constructor();
    isAllowed(key: string, config: RateLimitConfig): boolean;
    getRemaining(key: string, config: RateLimitConfig): number;
    getResetTime(key: string): number | null;
    reset(key: string): void;
    clear(): void;
    getStats(): {
        totalKeys: number;
        keys: Array<{
            key: string;
            count: number;
            resetTime: number;
        }>;
    };
    private cleanupExpiredEntries;
    onModuleDestroy(): void;
}
