import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from '../services/rate-limiter.service';
export declare class RateLimitMiddleware implements NestMiddleware {
    private rateLimiter;
    private readonly limits;
    constructor(rateLimiter: RateLimiterService);
    use(req: Request, res: Response, next: NextFunction): void;
}
