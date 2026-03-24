/**
 * Relational Data Interface for JSONB Storage
 * Supports product relationships and cross-references
 * Requirements: 3.1
 */

export interface RelationalData {
  matching_grouts?: string[]; // SKUs
  similar_alternatives?: string[]; // SKUs
  complementary_products?: string[]; // SKUs
  required_accessories?: string[]; // SKUs
  color_variants?: string[]; // SKUs
  size_variants?: string[]; // SKUs
}
