import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // Backward compatibility field
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}
