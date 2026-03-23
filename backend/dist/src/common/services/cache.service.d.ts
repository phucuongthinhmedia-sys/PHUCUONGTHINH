export interface CacheOptions {
    ttl?: number;
    key: string;
}
export declare class CacheService {
    private cache;
    private cleanupInterval;
    constructor();
    get<T>(key: string): T | null;
    set<T>(key: string, value: T, ttl?: number): void;
    delete(key: string): boolean;
    clear(): void;
    has(key: string): boolean;
    getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
    invalidatePattern(pattern: string): number;
    getStats(): {
        size: number;
        keys: string[];
    };
    private cleanupExpiredEntries;
    onModuleDestroy(): void;
}
