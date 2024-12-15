import { IsString, IsNumber, IsUUID, IsPositive, IsInt, IsOptional, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(5, 500)
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsUUID()
  categoryId: string;
}
