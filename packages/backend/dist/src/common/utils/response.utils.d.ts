import { ApiSuccessResponse, PaginatedResponse } from '../dto/api-response.dto';
export declare class ResponseUtils {
    static success<T>(data: T, message?: string, path?: string): Omit<ApiSuccessResponse<T>, 'timestamp' | 'path'>;
    static paginated<T>(data: T[], pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    }, message?: string): Omit<PaginatedResponse<T>, 'timestamp' | 'path'>;
    static created<T>(data: T, message?: string): Omit<ApiSuccessResponse<T>, 'timestamp' | 'path'>;
    static updated<T>(data: T, message?: string): Omit<ApiSuccessResponse<T>, 'timestamp' | 'path'>;
    static deleted(message?: string): Omit<ApiSuccessResponse<null>, 'timestamp' | 'path'>;
}
