import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsOptional()
  @IsString()
  @IsIn(['new', 'contacted', 'converted'])
  status?: string;
}
