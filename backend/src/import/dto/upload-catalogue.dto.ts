import { IsNotEmpty, IsString } from 'class-validator';

export class UploadCatalogueDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
