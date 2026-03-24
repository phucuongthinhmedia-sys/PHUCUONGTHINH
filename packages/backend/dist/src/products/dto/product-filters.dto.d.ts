export declare class ProductFiltersDto {
    categories?: string[];
    styles?: string[];
    spaces?: string[];
    technical_specs?: Record<string, any>;
    search?: string;
    page?: number;
    limit?: number;
    published?: 'true' | 'false' | 'all';
}
