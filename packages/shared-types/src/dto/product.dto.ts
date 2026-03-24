/**
 * Product DTOs for API requests and responses
 * Shared between backend and frontend
 */

import {
  ProductStatus,
  StockStatus,
  TechnicalData,
  MarketingContent,
  DigitalAssets,
  RelationalData,
  AISemanticLayer,
} from "../domain/product.types";

export interface CreateProductDto {
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
  technical_data?: TechnicalData;
  marketing_content?: MarketingContent;
  digital_assets?: DigitalAssets;
  relational_data?: RelationalData;
  ai_semantic_layer?: AISemanticLayer;
  // Backward compatibility fields
  description?: string;
  technical_specs?: Record<string, any>;
  style_ids?: string[];
  space_ids?: string[];
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  brand_id?: string;
  category_id?: string;
  sub_category_id?: string;
  collection_id?: string;
  designer_id?: string;
  status?: ProductStatus;
  base_price_vnd?: number;
  stock_status?: StockStatus;
  technical_data?: TechnicalData;
  marketing_content?: MarketingContent;
  digital_assets?: DigitalAssets;
  relational_data?: RelationalData;
  ai_semantic_layer?: AISemanticLayer;
  // Backward compatibility fields
  description?: string;
  technical_specs?: Record<string, any>;
  is_published?: boolean;
  style_ids?: string[];
  space_ids?: string[];
}

export interface ProductFiltersDto {
  categories?: string[];
  styles?: string[];
  spaces?: string[];
  technical_specs?: Record<string, any>;
  search?: string;
  page?: number;
  limit?: number;
  published?: "true" | "false" | "all";
}
