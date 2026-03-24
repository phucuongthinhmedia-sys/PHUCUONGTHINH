import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../services/logger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private loggerService;
    constructor(loggerService: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
