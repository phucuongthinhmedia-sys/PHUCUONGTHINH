/**
 * Product domain types
 * Shared between backend and frontend
 */

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}

export interface Dimensions {
  width_mm?: number;
  length_mm?: number;
  thickness_mm?: number;
  weight_kg?: number;
}

export interface PerformanceSpecs {
  slip_resistance?: string;
  water_absorption?: number;
  frost_resistance?: boolean;
  fire_rating?: string;
  wear_rating?: string;
}

export interface Installation {
  method?: string[];
  tools_required?: string[];
  difficulty_level?: "easy" | "medium" | "hard";
}

export interface TechnicalData {
  dimensions?: Dimensions;
  material?: string;
  performance_specs?: PerformanceSpecs;
  installation?: Installation;
  certifications?: string[];
  warranty_years?: number;
}

export interface MarketingContent {
  short_description?: { [language: string]: string };
  long_description?: { [language: string]: string };
  target_spaces?: string[];
  design_styles?: string[];
  key_features?: { [language: string]: string[] };
  care_instructions?: { [language: string]: string };
  seo_keywords?: { [language: string]: string[] };
}

export interface ArchitectFiles {
  seamless_texture_map?: string;
  normal_map?: string;
  displacement_map?: string;
  cad_files?: string[];
}

export interface Videos {
  installation_guide?: string;
  product_showcase?: string;
}

export interface Documents {
  technical_sheet?: string;
  installation_guide?: string;
  care_guide?: string;
}

export interface DigitalAssets {
  cover_image?: string;
  lifestyle_images?: string[];
  technical_drawings?: string[];
  architect_files?: ArchitectFiles;
  videos?: Videos;
  documents?: Documents;
}

export interface RelationalData {
  matching_grouts?: string[];
  similar_alternatives?: string[];
  complementary_products?: string[];
  required_accessories?: string[];
  color_variants?: string[];
  size_variants?: string[];
}

export interface AISemanticLayer {
  semantic_text?: { [language: string]: string };
  embedding_vector_id?: string;
  auto_generated_tags?: string[];
  similarity_score?: number;
  content_quality_score?: number;
  last_ai_update?: string;
}

export interface Product {
  id: string;
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
  is_published?: boolean;
  style_ids?: string[];
  space_ids?: string[];
  created_at: string;
  updated_at: string;
}
