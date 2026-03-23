import { Injectable } from '@nestjs/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResult;
}

@Injectable()
export class PaginationService {
  private readonly DEFAULT_LIMIT = 20;
  private readonly MAX_LIMIT = 100;

  /**
   * Calculate pagination parameters and metadata
   */
  calculatePagination(
    total: number,
    options: PaginationOptions = {},
  ): PaginationResult {
    const page = Math.max(1, options.page || 1);
    const maxLimit = options.maxLimit || this.MAX_LIMIT;
    const limit = Math.min(
      Math.max(1, options.limit || this.DEFAULT_LIMIT),
      maxLimit,
    );

    const offset = (page - 1) * limit;
    const total_pages = Math.ceil(total / limit);
    const has_next = page < total_pages;
    const has_previous = page > 1;

    return {
      page,
      limit,
      total,
      total_pages,
      has_next,
      has_previous,
      offset,
    };
  }

  /**
   * Create a paginated response
   */
  createPaginatedResponse<T>(
    data: T[],
    total: number,
    options: PaginationOptions = {},
  ): PaginatedResponse<T> {
    const pagination = this.calculatePagination(total, options);

    return {
      data,
      pagination,
    };
  }

  /**
   * Validate pagination parameters
   */
  validatePaginationOptions(options: PaginationOptions): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (options.page !== undefined) {
      if (!Number.isInteger(options.page) || options.page < 1) {
        errors.push('Page must be a positive integer');
      }
    }

    if (options.limit !== undefined) {
      if (!Number.isInteger(options.limit) || options.limit < 1) {
        errors.push('Limit must be a positive integer');
      }

      const maxLimit = options.maxLimit || this.MAX_LIMIT;
      if (options.limit > maxLimit) {
        errors.push(`Limit cannot exceed ${maxLimit}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get pagination info for cursor-based pagination (for future use)
   */
  createCursorPagination<T extends { id: string; created_at: Date }>(
    data: T[],
    limit: number,
    hasMore: boolean,
  ): {
    data: T[];
    pagination: {
      limit: number;
      has_next: boolean;
      next_cursor?: string;
    };
  } {
    const nextCursor =
      hasMore && data.length > 0
        ? Buffer.from(
            JSON.stringify({
              id: data[data.length - 1].id,
              created_at: data[data.length - 1].created_at.toISOString(),
            }),
          ).toString('base64')
        : undefined;

    return {
      data,
      pagination: {
        limit,
        has_next: hasMore,
        next_cursor: nextCursor,
      },
    };
  }

  /**
   * Parse cursor for cursor-based pagination
   */
  parseCursor(cursor: string): { id: string; created_at: string } | null {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      const parsed = JSON.parse(decoded);

      if (parsed.id && parsed.created_at) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Calculate optimal batch size for database operations
   */
  calculateOptimalBatchSize(
    totalItems: number,
    maxBatchSize: number = 1000,
  ): number {
    if (totalItems <= 100) return totalItems;
    if (totalItems <= 1000) return Math.ceil(totalItems / 2);

    return Math.min(maxBatchSize, Math.ceil(totalItems / 10));
  }

  /**
   * Create pagination links for API responses
   */
  createPaginationLinks(
    baseUrl: string,
    pagination: PaginationResult,
    queryParams: Record<string, any> = {},
  ): {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  } {
    const createUrl = (page: number) => {
      const params = new URLSearchParams({
        ...queryParams,
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      return `${baseUrl}?${params.toString()}`;
    };

    const links: any = {};

    // First page link
    if (pagination.page > 1) {
      links.first = createUrl(1);
    }

    // Previous page link
    if (pagination.has_previous) {
      links.previous = createUrl(pagination.page - 1);
    }

    // Next page link
    if (pagination.has_next) {
      links.next = createUrl(pagination.page + 1);
    }

    // Last page link
    if (pagination.page < pagination.total_pages) {
      links.last = createUrl(pagination.total_pages);
    }

    return links;
  }
}
