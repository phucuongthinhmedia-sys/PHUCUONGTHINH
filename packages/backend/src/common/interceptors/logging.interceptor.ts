import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const requestId = randomUUID();
    const method = request.method;
    const endpoint = request.url;
    const startTime = Date.now();

    // Attach requestId to request for use in other services
    request.requestId = requestId;

    // Skip logging common GET requests in production to reduce noise
    const isProduction = process.env.NODE_ENV === 'production';
    const isCommonGetRequest =
      method === 'GET' &&
      (endpoint.startsWith('/api/v1/products/') ||
        endpoint.startsWith('/api/v1/media/') ||
        endpoint === '/api/v1/products');
    const shouldSkipLog = isProduction && isCommonGetRequest;

    if (!shouldSkipLog) {
      this.loggerService.logRequest(method, endpoint, requestId);
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Only log responses that are errors or slow (>3s) in production
        const isError = statusCode >= 400;
        const isSlow = duration > 3000;

        if (!shouldSkipLog || isError || isSlow) {
          this.loggerService.logResponse(
            method,
            endpoint,
            statusCode,
            duration,
            requestId,
          );
        }
      }),
    );
  }
}
