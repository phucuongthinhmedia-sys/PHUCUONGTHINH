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

    this.loggerService.logRequest(method, endpoint, requestId);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.loggerService.logResponse(
          method,
          endpoint,
          statusCode,
          duration,
          requestId,
        );
      }),
    );
  }
}
