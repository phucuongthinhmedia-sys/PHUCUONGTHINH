import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { CombinedFilterService } from './services/combined-filter.service';
import { ProductsEventService } from './products-events.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly combinedFilterService;
    private readonly productsEventService;
    constructor(productsService: ProductsService, combinedFilterService: CombinedFilterService, productsEventService: ProductsEventService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    events(): import("rxjs").Observable<{
        data: string;
    }>;
    findAll(filters: ProductFiltersDto): Promise<import("./services/combined-filter.service").FilterResponse>;
    findAllWithFilters(filters: ProductFiltersDto): Promise<import("./services/combined-filter.service").FilterResponse>;
    findAllWithEnhancedFilters(query: any): Promise<import("./services/combined-filter.service").FilterResponse>;
    searchProducts(query: any): Promise<string[]>;
    getSearchSuggestions(query: string, limit?: string): Promise<string[]>;
    getPopularSearchTerms(limit?: string): Promise<string[]>;
    searchWithFilters(query: any): Promise<import("./services/combined-filter.service").FilterResponse>;
    findAllWithOptimizedFilters(query: any): Promise<import("./services/combined-filter.service").FilterResponse>;
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
    clearCache(productId?: string): {
        message: string;
    };
    getFilterStatistics(): Promise<{
        total_products: number;
        published_products: number;
        unpublished_products: number;
        category_distribution: {
            category: string;
            count: number;
        }[];
    }>;
    findOne(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    getGoldenRecord(id: string): Promise<any>;
    findBySku(sku: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    getGoldenRecordBySku(sku: string): Promise<any>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    updatePut(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    publish(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    unpublish(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        sku: string;
        description: string | null;
        technical_specs: string;
        is_published: boolean;
        category_id: string;
    }>;
    remove(id: string): Promise<void>;
}
