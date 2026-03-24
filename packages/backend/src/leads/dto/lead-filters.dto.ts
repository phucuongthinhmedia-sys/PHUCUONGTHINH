import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class LeadFiltersDto {
  @IsOptional()
  @IsString()
  @IsIn(['new', 'contacted', 'converted'])
  status?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
