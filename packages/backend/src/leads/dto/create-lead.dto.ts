import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsIn,
  IsDateString,
  IsArray,
  ValidateIf,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsIn(['appointment', 'quote'])
  inquiry_type: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  project_details?: string;

  @IsOptional()
  @IsDateString()
  preferred_date?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  product_ids?: string[];

  // Custom validation: at least one contact method required
  @ValidateIf((o) => !o.phone)
  @IsNotEmpty({ message: 'Either email or phone must be provided' })
  emailRequired?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Either email or phone must be provided' })
  phoneRequired?: string;
}
