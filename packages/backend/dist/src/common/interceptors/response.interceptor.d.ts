import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiSuccessResponse, PaginatedResponse } from '../dto/api-response.dto';
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T> | PaginatedResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T> | PaginatedResponse<T>>;
}
