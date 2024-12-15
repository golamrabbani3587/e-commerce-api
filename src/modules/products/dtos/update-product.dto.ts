import { IsString, IsNumber, IsUUID, IsPositive, IsInt, IsOptional, Length } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stockQuantity?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
