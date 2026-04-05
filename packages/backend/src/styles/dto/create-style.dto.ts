import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateStyleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
