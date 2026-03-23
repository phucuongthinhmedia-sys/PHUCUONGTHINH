import { TechnicalDataDto, MarketingContentDto, DigitalAssetsDto, RelationalDataDto, AISemanticLayerDto } from './jsonb-validation.dto';
export declare enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DISCONTINUED = "DISCONTINUED"
}
export declare enum StockStatus {
    IN_STOCK = "IN_STOCK",
    LOW_STOCK = "LOW_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    DISCONTINUED = "DISCONTINUED"
}
export declare class CreateProductDto {
    name: string;
    sku: string;
    brand_id?: string;
    category_id: string;
    sub_category_id?: string;
    collection_id?: string;
    designer_id?: string;
    status?: ProductStatus;
    base_price_vnd?: number;
    stock_status?: StockStatus;
    technical_data?: TechnicalDataDto;
    marketing_content?: MarketingContentDto;
    digital_assets?: DigitalAssetsDto;
    relational_data?: RelationalDataDto;
    ai_semantic_layer?: AISemanticLayerDto;
    description?: string;
    technical_specs?: any;
    style_ids?: string[];
    space_ids?: string[];
}
