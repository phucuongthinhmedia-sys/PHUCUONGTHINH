/**
 * Marketing Content Interface for JSONB Storage
 * Supports multi-language descriptions and marketing information
 * Requirements: 3.1, 8.1
 */

export interface MarketingContent {
  short_description?: {
    [language: string]: string; // Multi-language support
  };
  long_description?: {
    [language: string]: string;
  };
  target_spaces?: string[];
  design_styles?: string[];
  key_features?: {
    [language: string]: string[];
  };
  care_instructions?: {
    [language: string]: string;
  };
  seo_keywords?: {
    [language: string]: string[];
  };
}
