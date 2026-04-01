/**
 * Client-side cache utilities for better performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  timerId: ReturnType<typeof setTimeout>;
}

class ClientCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 60_000; // 1 minute

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Lazy expiry check as a safety net (active cleanup via setTimeout is primary)
    if (Date.now() - entry.timestamp > entry.ttl) {
      this._evict(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // Clear existing timer if key is being overwritten
    const existing = this.cache.get(key);
    if (existing) clearTimeout(existing.timerId);

    const timerId = setTimeout(() => this._evict(key), ttl);

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      timerId,
    });
  }

  delete(key: string): void {
    this._evict(key);
  }

  clear(): void {
    for (const key of this.cache.keys()) this._evict(key);
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) this._evict(key);
    }
  }

  invalidateProduct(productId?: string): void {
    if (productId) this.invalidatePattern(new RegExp(productId));
    this.invalidatePattern(/^products:/);
  }

  private _evict(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      clearTimeout(entry.timerId);
      this.cache.delete(key);
    }
  }
}

export const clientCache = new ClientCache();
