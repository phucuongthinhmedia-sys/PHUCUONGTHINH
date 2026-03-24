import { PrismaService } from '../../prisma/prisma.service';
export interface SearchFilters {
    query?: string;
    categories?: string[];
    published?: 'true' | 'false' | 'all';
}
export interface SearchResult {
    id: string;
    name: string;
    sku: string;
    description?: string;
    relevance_score: number;
    match_fields: string[];
}
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchProducts(searchQuery: string, filters?: SearchFilters, limit?: number, offset?: number): Promise<{
        products: never[];
        total: number;
        query: string;
        search_terms?: undefined;
    } | {
        products: {
            technical_specs: any;
            relevance_score: number;
            match_fields: string[];
            category: {
                id: string;
                created_at: Date;
                updated_at: Date;
                name: string;
                slug: string;
                parent_id: string | null;
            };
            media: {
                id: string;
                created_at: Date;
                updated_at: Date;
                file_url: string;
                file_type: string;
                media_type: string;
                sort_order: number;
                is_cover: boolean;
                file_size: number | null;
                alt_text: string | null;
                product_id: string;
            }[];
            style_tags: ({
                style: {
                    id: string;
                    created_at: Date;
                    updated_at: Date;
                    name: string;
                };
            } & {
                product_id: string;
                style_id: string;
            })[];
            space_tags: ({
                space: {
                    id: string;
                    created_at: Date;
                    updated_at: Date;
                    name: string;
                };
            } & {
                product_id: string;
                space_id: string;
            })[];
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
            sku: string;
            description: string | null;
            is_published: boolean;
            category_id: string;
        }[];
        total: number;
        query: string;
        search_terms: string[];
    }>;
    getSearchSuggestions(partialQuery: string, limit?: number): Promise<string[]>;
    getPopularSearchTerms(limit?: number): Promise<string[]>;
    private normalizeSearchQuery;
    private extractSearchTerms;
    private buildBaseWhere;
    private buildSearchConditions;
    private calculateRelevanceScore;
    private parseJsonSafely;
    searchWithFilters(searchQuery: string, inspirationFilters?: any, technicalFilters?: any, baseFilters?: SearchFilters, pagination?: {
        page: number;
        limit: number;
    }): Promise<{
        products: never[];
        total: number;
        pagination: {
            page: number;
            limit: number;
            total: number;
            total_pages: number;
        };
        query: string;
        search_terms?: undefined;
    } | {
        products: {
            technical_specs: any;
            relevance_score: number;
            match_fields: string[];
            category: {
                id: string;
                created_at: Date;
                updated_at: Date;
                name: string;
                slug: string;
                parent_id: string | null;
            };
            media: {
                id: string;
                created_at: Date;
                updated_at: Date;
                file_url: string;
                file_type: string;
                media_type: string;
                sort_order: number;
                is_cover: boolean;
                file_size: number | null;
                alt_text: string | null;
                product_id: string;
            }[];
            style_tags: ({
                style: {
                    id: string;
                    created_at: Date;
                    updated_at: Date;
                    name: string;
                };
            } & {
                product_id: string;
                style_id: string;
            })[];
            space_tags: ({
                space: {
                    id: string;
                    created_at: Date;
                    updated_at: Date;
                    name: string;
                };
            } & {
                product_id: string;
                space_id: string;
            })[];
            id: string;
            created_at: Date;
            updated_at: Date;
            name: string;
            sku: string;
            description: string | null;
            is_published: boolean;
            category_id: string;
        }[];
        total: number;
        pagination: {
            page: number;
            limit: number;
            total: number;
            total_pages: number;
        };
        query: string;
        search_terms: string[];
    }>;
}
