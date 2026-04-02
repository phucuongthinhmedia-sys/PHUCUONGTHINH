import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsArray()
  @IsOptional()
  tags?: Array<{
    entity_type: 'ORDER' | 'CUSTOMER' | 'PRODUCT' | 'LEAD';
    entity_id: string;
  }>;
}

export class AddDocumentTagDto {
  @IsString()
  @IsNotEmpty()
  entity_type: 'ORDER' | 'CUSTOMER' | 'PRODUCT' | 'LEAD';

  @IsString()
  @IsNotEmpty()
  entity_id: string;
}
