import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityHeadersService } from '../services/security-headers.service';
export declare class SecurityHeadersMiddleware implements NestMiddleware {
    private securityHeaders;
    constructor(securityHeaders: SecurityHeadersService);
    use(req: Request, res: Response, next: NextFunction): void;
}
