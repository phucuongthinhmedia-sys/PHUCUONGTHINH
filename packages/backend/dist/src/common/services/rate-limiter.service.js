"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterService = void 0;
const common_1 = require("@nestjs/common");
let RateLimiterService = class RateLimiterService {
    limits = new Map();
    cleanupInterval;
    constructor() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredEntries();
        }, 5 * 60 * 1000);
    }
    isAllowed(key, config) {
        const now = Date.now();
        const entry = this.limits.get(key);
        if (!entry || now > entry.resetTime) {
            this.limits.set(key, {
                count: 1,
                resetTime: now + config.windowMs,
            });
            return true;
        }
        if (entry.count < config.maxRequests) {
            entry.count++;
            return true;
        }
        return false;
    }
    getRemaining(key, config) {
        const now = Date.now();
        const entry = this.limits.get(key);
        if (!entry || now > entry.resetTime) {
            return config.maxRequests;
        }
        return Math.max(0, config.maxRequests - entry.count);
    }
    getResetTime(key) {
        const entry = this.limits.get(key);
        return entry ? entry.resetTime : null;
    }
    reset(key) {
        this.limits.delete(key);
    }
    clear() {
        this.limits.clear();
    }
    getStats() {
        const keys = Array.from(this.limits.entries()).map(([key, entry]) => ({
            key,
            count: entry.count,
            resetTime: entry.resetTime,
        }));
        return {
            totalKeys: this.limits.size,
            keys,
        };
    }
    cleanupExpiredEntries() {
        const now = Date.now();
        let count = 0;
        for (const [key, entry] of this.limits.entries()) {
            if (now > entry.resetTime) {
                this.limits.delete(key);
                count++;
            }
        }
        if (count > 0) {
            console.log(`Rate limiter cleanup: removed ${count} expired entries`);
        }
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.limits.clear();
    }
};
exports.RateLimiterService = RateLimiterService;
exports.RateLimiterService = RateLimiterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RateLimiterService);
//# sourceMappingURL=rate-limiter.service.js.map