export interface CacheOptions {
    ttl?: number;
    maxSize?: number;
}
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
}
export declare class CacheService {
    private cache;
    private readonly DEFAULT_TTL;
    private readonly MAX_CACHE_SIZE;
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, options?: CacheOptions): void;
    delete(key: string): boolean;
    clear(): void;
    has(key: string): boolean;
    getStats(): {
        size: number;
        maxSize: number;
        hitRate: number;
        entries: Array<{
            key: string;
            size: number;
            accessCount: number;
            age: number;
            ttl: number;
        }>;
    };
    generateFilterCacheKey(filters: any): string;
    generateSearchCacheKey(query: string, filters?: any, pagination?: any): string;
    cached<T>(key: string, fn: () => Promise<T>, options?: CacheOptions): Promise<T>;
    invalidatePattern(pattern: RegExp): number;
    invalidateProductCache(productId?: string): number;
    private isExpired;
    private evictExpired;
    private enforceSizeLimit;
    private estimateSize;
}
