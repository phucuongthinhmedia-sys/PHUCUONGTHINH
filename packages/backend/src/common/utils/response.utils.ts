import { ApiSuccessResponse, PaginatedResponse } from '../dto/api-response.dto';

export class ResponseUtils {
  static success<T>(
    data: T,
    message?: string,
    path?: string,
  ): Omit<ApiSuccessResponse<T>, 'timestamp' | 'path'> {
    return {
      success: true,
      data,
      message,
    };
  }

  static paginated<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    },
    message?: string,
  ): Omit<PaginatedResponse<T>, 'timestamp' | 'path'> {
    return {
      success: true,
      data,
      pagination,
      message,
    };
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
  ): Omit<ApiSuccessResponse<T>, 'timestamp' | 'path'> {
    return {
      success: true,
      data,
      message,
    };
  }

  static updated<T>(
    data: T,
    message: string = 'Resource updated successfully',
  ): Omit<ApiSuccessResponse<T>, 'timestamp' | 'path'> {
    return {
      success: true,
      data,
      message,
    };
  }

  static deleted(
    message: string = 'Resource deleted successfully',
  ): Omit<ApiSuccessResponse<null>, 'timestamp' | 'path'> {
    return {
      success: true,
      data: null,
      message,
    };
  }
}
