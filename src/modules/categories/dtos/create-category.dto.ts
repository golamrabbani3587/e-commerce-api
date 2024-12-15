import { IsString, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;
}