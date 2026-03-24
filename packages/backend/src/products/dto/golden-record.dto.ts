import {
  TechnicalData,
  MarketingContent,
  DigitalAssets,
  RelationalData,
  AISemanticLayer,
} from '../../types';

/**
 * Golden Record DTO - Exact structure that API should return
 * Requirements: 4.1
 */
export interface GoldenRecordDto {
  product_id: string;
  sku: string;
  identification: {
    name: string;
    brand_id: string;
    category_id: string;
    sub_category_id?: string;
    collection_id?: string;
    designer_id?: string;
    status: string;
    base_price_vnd?: number;
    stock_status: string;
    created_at: string;
    updated_at: string;
  };
  technical_data?: TechnicalData;
  marketing_content?: MarketingContent;
  digital_assets?: DigitalAssets;
  relational_data?: RelationalData;
  ai_semantic_layer?: AISemanticLayer;
  erp_sync_data?: {
    last_sync?: string;
    sync_status?: string;
    external_id?: string;
  };
}

/**
 * ERP Sync Data interface for Golden Record
 */
export interface ERPSyncData {
  last_sync?: string;
  sync_status?: string;
  external_id?: string;
}
