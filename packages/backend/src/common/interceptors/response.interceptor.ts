import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse, PaginatedResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T> | PaginatedResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T> | PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const timestamp = new Date().toISOString();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // Check if the response has pagination metadata
        if (data && typeof data === 'object' && 'pagination' in data) {
          return {
            success: true,
            data: data.products || data.data || data.items || [],
            pagination: data.pagination,
            available_filters: data.available_filters,
            message: data.message,
            timestamp,
            path,
          } as PaginatedResponse<T>;
        }

        // Standard success response
        return {
          success: true,
          data,
          message: data?.message,
          timestamp,
          path,
        } as ApiSuccessResponse<T>;
      }),
    );
  }
}
