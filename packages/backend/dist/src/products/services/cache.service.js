"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    cache = new Map();
    DEFAULT_TTL = 300;
    MAX_CACHE_SIZE = 1000;
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    set(key, data, options = {}) {
        const ttl = (options.ttl || this.DEFAULT_TTL) * 1000;
        const maxSize = options.maxSize || this.MAX_CACHE_SIZE;
        this.evictExpired();
        this.enforceSizeLimit(maxSize - 1);
        const entry = {
            data,
            timestamp: Date.now(),
            ttl,
            accessCount: 0,
            lastAccessed: Date.now(),
        };
        this.cache.set(key, entry);
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    getStats() {
        const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
            key,
            size: this.estimateSize(entry.data),
            accessCount: entry.accessCount,
            age: Date.now() - entry.timestamp,
            ttl: entry.ttl,
        }));
        const totalAccesses = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
        const hitRate = totalAccesses > 0 ? entries.length / totalAccesses : 0;
        return {
            size: this.cache.size,
            maxSize: this.MAX_CACHE_SIZE,
            hitRate,
            entries,
        };
    }
    generateFilterCacheKey(filters) {
        const keyObject = {
            categories: filters.categories?.sort(),
            styles: filters.inspiration?.styles?.sort(),
            spaces: filters.inspiration?.spaces?.sort(),
            technical: filters.technical
                ? Object.keys(filters.technical)
                    .sort()
                    .reduce((obj, key) => {
                    obj[key] = filters.technical[key];
                    return obj;
                }, {})
                : undefined,
            search: filters.search,
            published: filters.published,
            page: filters.page,
            limit: filters.limit,
        };
        Object.keys(keyObject).forEach((key) => {
            if (keyObject[key] === undefined) {
                delete keyObject[key];
            }
        });
        return `filters:${Buffer.from(JSON.stringify(keyObject)).toString('base64')}`;
    }
    generateSearchCacheKey(query, filters = {}, pagination = {}) {
        const keyObject = {
            query: query.trim().toLowerCase(),
            filters,
            pagination,
        };
        return `search:${Buffer.from(JSON.stringify(keyObject)).toString('base64')}`;
    }
    async cached(key, fn, options = {}) {
        const cached = this.get(key);
        if (cached !== null) {
            return cached;
        }
        const result = await fn();
        this.set(key, result, options);
        return result;
    }
    invalidatePattern(pattern) {
        let deletedCount = 0;
        for (const key of this.cache.keys()) {
            if (pattern.test(key)) {
                this.cache.delete(key);
                deletedCount++;
            }
        }
        return deletedCount;
    }
    invalidateProductCache(productId) {
        if (productId) {
            return this.invalidatePattern(new RegExp(`product:${productId}`));
        }
        else {
            return this.invalidatePattern(new RegExp('^(filters|search|products):'));
        }
    }
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    evictExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
    enforceSizeLimit(maxSize) {
        if (this.cache.size <= maxSize) {
            return;
        }
        const entries = Array.from(this.cache.entries()).sort(([, a], [, b]) => {
            const scoreA = a.accessCount * 0.7 + (Date.now() - a.lastAccessed) * -0.3;
            const scoreB = b.accessCount * 0.7 + (Date.now() - b.lastAccessed) * -0.3;
            return scoreA - scoreB;
        });
        const toRemove = this.cache.size - maxSize;
        for (let i = 0; i < toRemove; i++) {
            this.cache.delete(entries[i][0]);
        }
    }
    estimateSize(data) {
        try {
            return JSON.stringify(data).length * 2;
        }
        catch {
            return 1000;
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map