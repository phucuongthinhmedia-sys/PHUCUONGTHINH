import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  MaxLength,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TechnicalDataDto,
  MarketingContentDto,
  DigitalAssetsDto,
  RelationalDataDto,
  AISemanticLayerDto,
} from './jsonb-validation.dto';

// Enums for validation
export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @IsOptional()
  @IsString()
  brand_id?: string;

  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsOptional()
  @IsString()
  sub_category_id?: string;

  @IsOptional()
  @IsString()
  collection_id?: string;

  @IsOptional()
  @IsString()
  designer_id?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsNumber()
  base_price_vnd?: number;

  @IsOptional()
  @IsEnum(StockStatus)
  stock_status?: StockStatus;

  // JSONB Fields
  @IsOptional()
  @ValidateNested()
  @Type(() => TechnicalDataDto)
  technical_data?: TechnicalDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MarketingContentDto)
  marketing_content?: MarketingContentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DigitalAssetsDto)
  digital_assets?: DigitalAssetsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RelationalDataDto)
  relational_data?: RelationalDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AISemanticLayerDto)
  ai_semantic_layer?: AISemanticLayerDto;

  // Backward compatibility - deprecated fields
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsObject()
  technical_specs?: any; // Make it more flexible

  @IsOptional()
  @IsArray()
  style_ids?: string[];

  @IsOptional()
  @IsArray()
  space_ids?: string[];
}
