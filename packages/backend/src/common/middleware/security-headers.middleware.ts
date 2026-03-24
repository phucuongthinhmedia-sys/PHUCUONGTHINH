import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityHeadersService } from '../services/security-headers.service';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  constructor(private securityHeaders: SecurityHeadersService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Apply security headers to response
    const headers = this.securityHeaders.getSecurityHeaders();

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    next();
  }
}
