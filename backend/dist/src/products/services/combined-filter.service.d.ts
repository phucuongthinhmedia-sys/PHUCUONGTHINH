import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesService } from '../../categories/categories.service';
import { InspirationFilterService, InspirationFilters } from './inspiration-filter.service';
import { TechnicalFilterService, TechnicalFilters } from './technical-filter.service';
import { SearchService } from './search.service';
import { PaginationService } from './pagination.service';
import { CacheService } from './cache.service';
import { PerformanceService } from './performance.service';
export interface CombinedFilters {
    categories?: string[];
    search?: string;
    published?: 'true' | 'false' | 'all';
    inspiration?: InspirationFilters;
    technical?: TechnicalFilters;
    page?: number;
    limit?: number;
}
export interface FilterResponse {
    products: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
    available_filters: {
        inspiration: {
            styles: any[];
            spaces: any[];
        };
        technical: Record<string, any[]>;
        categories: any[];
    };
}
export declare class CombinedFilterService {
    private prisma;
    private categoriesService;
    private inspirationFilterService;
    private technicalFilterService;
    private searchService;
    private paginationService;
    private cacheService;
    private performanceService;
    constructor(prisma: PrismaService, categoriesService: CategoriesService, inspirationFilterService: InspirationFilterService, technicalFilterService: TechnicalFilterService, searchService: SearchService, paginationService: PaginationService, cacheService: CacheService, performanceService: PerformanceService);
    filterProducts(filters: CombinedFilters): Promise<FilterResponse>;
    private getAvailableFilters;
    private getAvailableFiltersCached;
    filterProductsOptimized(filters: CombinedFilters): Promise<FilterResponse>;
    clearProductCaches(productId?: string): number;
    getCacheStats(): {
        size: number;
        maxSize: number;
        hitRate: number;
        entries: Array<{
            key: string;
            size: number;
            accessCount: number;
            age: number;
            ttl: number;
        }>;
    };
    private parseJsonSafely;
    filterProductsWithSearch(filters: CombinedFilters): Promise<FilterResponse>;
    getSearchSuggestions(query: string, limit?: number): Promise<string[]>;
    getPopularSearchTerms(limit?: number): Promise<string[]>;
    getFilterStatistics(): Promise<{
        total_products: number;
        published_products: number;
        unpublished_products: number;
        category_distribution: {
            category: string;
            count: number;
        }[];
    }>;
}
