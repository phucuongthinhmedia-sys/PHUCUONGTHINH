import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}