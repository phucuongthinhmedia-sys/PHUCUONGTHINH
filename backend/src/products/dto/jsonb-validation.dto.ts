import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
  IsIn,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Validation DTOs for JSONB structures
 * Requirements: 3.1
 */

// Technical Data Validation
export class DimensionsDto {
  @IsOptional()
  @IsNumber()
  width_mm?: number;

  @IsOptional()
  @IsNumber()
  length_mm?: number;

  @IsOptional()
  @IsNumber()
  thickness_mm?: number;

  @IsOptional()
  @IsNumber()
  weight_kg?: number;
}

export class PerformanceSpecsDto {
  @IsOptional()
  @IsString()
  slip_resistance?: string;

  @IsOptional()
  @IsNumber()
  water_absorption?: number;

  @IsOptional()
  @IsBoolean()
  frost_resistance?: boolean;

  @IsOptional()
  @IsString()
  fire_rating?: string;

  @IsOptional()
  @IsString()
  wear_rating?: string;
}

export class InstallationDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  method?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools_required?: string[];

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty_level?: 'easy' | 'medium' | 'hard';
}

export class TechnicalDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PerformanceSpecsDto)
  performance_specs?: PerformanceSpecsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => InstallationDto)
  installation?: InstallationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsNumber()
  warranty_years?: number;
}

// Marketing Content Validation
export class MarketingContentDto {
  @IsOptional()
  @IsObject()
  short_description?: { [language: string]: string };

  @IsOptional()
  @IsObject()
  long_description?: { [language: string]: string };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  target_spaces?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  design_styles?: string[];

  @IsOptional()
  @IsObject()
  key_features?: { [language: string]: string[] };

  @IsOptional()
  @IsObject()
  care_instructions?: { [language: string]: string };

  @IsOptional()
  @IsObject()
  seo_keywords?: { [language: string]: string[] };
}

// Digital Assets Validation
export class ArchitectFilesDto {
  @IsOptional()
  @IsString()
  seamless_texture_map?: string;

  @IsOptional()
  @IsString()
  normal_map?: string;

  @IsOptional()
  @IsString()
  displacement_map?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cad_files?: string[];
}

export class VideosDto {
  @IsOptional()
  @IsString()
  installation_guide?: string;

  @IsOptional()
  @IsString()
  product_showcase?: string;
}

export class DocumentsDto {
  @IsOptional()
  @IsString()
  technical_sheet?: string;

  @IsOptional()
  @IsString()
  installation_guide?: string;

  @IsOptional()
  @IsString()
  care_guide?: string;
}

export class DigitalAssetsDto {
  @IsOptional()
  @IsString()
  cover_image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lifestyle_images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technical_drawings?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ArchitectFilesDto)
  architect_files?: ArchitectFilesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideosDto)
  videos?: VideosDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;
}

// Relational Data Validation
export class RelationalDataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  matching_grouts?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  similar_alternatives?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complementary_products?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required_accessories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  color_variants?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  size_variants?: string[];
}

// AI Semantic Layer Validation
export class AISemanticLayerDto {
  @IsOptional()
  @IsObject()
  semantic_text?: { [language: string]: string };

  @IsOptional()
  @IsString()
  embedding_vector_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  auto_generated_tags?: string[];

  @IsOptional()
  @IsNumber()
  similarity_score?: number;

  @IsOptional()
  @IsNumber()
  content_quality_score?: number;

  @IsOptional()
  @IsISO8601()
  last_ai_update?: string;
}
