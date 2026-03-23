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
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const rate_limiter_service_1 = require("../services/rate-limiter.service");
let RateLimitMiddleware = class RateLimitMiddleware {
    rateLimiter;
    limits = {
        auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
        api: { windowMs: 60 * 1000, maxRequests: 100 },
        default: { windowMs: 60 * 1000, maxRequests: 1000 },
    };
    constructor(rateLimiter) {
        this.rateLimiter = rateLimiter;
    }
    use(req, res, next) {
        if (process.env.NODE_ENV === 'development') {
            return next();
        }
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.socket.remoteAddress ||
            'unknown';
        let config = this.limits.default;
        if (req.path.includes('/auth/login') ||
            req.path.includes('/auth/refresh')) {
            config = this.limits.auth;
        }
        else if (req.path.startsWith('/api/')) {
            config = this.limits.api;
        }
        const key = `${clientIp}:${req.path}`;
        if (!this.rateLimiter.isAllowed(key, config)) {
            const resetTime = this.rateLimiter.getResetTime(key);
            const retryAfter = resetTime
                ? Math.ceil((resetTime - Date.now()) / 1000)
                : 60;
            res.setHeader('Retry-After', retryAfter);
            res.setHeader('X-RateLimit-Limit', config.maxRequests);
            res.setHeader('X-RateLimit-Remaining', 0);
            if (resetTime) {
                res.setHeader('X-RateLimit-Reset', resetTime);
            }
            throw new common_1.HttpException(`Too many requests. Please try again after ${retryAfter} seconds.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const remaining = this.rateLimiter.getRemaining(key, config);
        const resetTime = this.rateLimiter.getResetTime(key);
        res.setHeader('X-RateLimit-Limit', config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', remaining);
        if (resetTime) {
            res.setHeader('X-RateLimit-Reset', resetTime);
        }
        next();
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rate_limiter_service_1.RateLimiterService])
], RateLimitMiddleware);
//# sourceMappingURL=rate-limit.middleware.js.map