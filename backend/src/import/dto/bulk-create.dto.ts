import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class BulkCreateDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  product_ids: string[];
}
