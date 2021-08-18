import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Field "name" is required' })
  @IsString({ message: 'Field "name" is of type string' })
  name: string;

  @IsNotEmpty({ message: 'Field "category" is required' })
  @IsString({ message: 'Field "category" is of type string' })
  category: string;

  @IsNotEmpty({ message: 'Field "image" is required' })
  @IsString({ message: 'Field "image" is of type string' })
  image: string;

  @IsNotEmpty({ message: 'Field "brand" is required' })
  @IsString({ message: 'Field "brand" is of type string' })
  brand: string;

  @IsNotEmpty({ message: 'Field "description" is required' })
  @IsString({ message: 'Field "description" is of type string' })
  description: string;

  @IsNotEmpty({ message: 'Field "slug" is required' })
  @IsString({ message: 'Field "slug" is of type string' })
  slug: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Field "price" is of type decimal(2)' },
  )
  @IsNotEmpty({ message: 'Field "price" is required' })
  @IsPositive({ message: 'Field "price" cannot be negative' })
  price: number;

  @IsInt({ message: 'Field "countInStock" is of type int' })
  @IsOptional()
  countInStock?: number;
}
