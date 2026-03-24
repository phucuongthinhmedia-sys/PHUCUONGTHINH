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
export declare class PaginationService {
    private readonly DEFAULT_LIMIT;
    private readonly MAX_LIMIT;
    calculatePagination(total: number, options?: PaginationOptions): PaginationResult;
    createPaginatedResponse<T>(data: T[], total: number, options?: PaginationOptions): PaginatedResponse<T>;
    validatePaginationOptions(options: PaginationOptions): {
        isValid: boolean;
        errors: string[];
    };
    createCursorPagination<T extends {
        id: string;
        created_at: Date;
    }>(data: T[], limit: number, hasMore: boolean): {
        data: T[];
        pagination: {
            limit: number;
            has_next: boolean;
            next_cursor?: string;
        };
    };
    parseCursor(cursor: string): {
        id: string;
        created_at: string;
    } | null;
    calculateOptimalBatchSize(totalItems: number, maxBatchSize?: number): number;
    createPaginationLinks(baseUrl: string, pagination: PaginationResult, queryParams?: Record<string, any>): {
        first?: string;
        previous?: string;
        next?: string;
        last?: string;
    };
}
