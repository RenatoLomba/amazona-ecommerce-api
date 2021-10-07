import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Property "orderItems" is required' })
  @IsArray({ message: 'Property "orderItems" is of type list' })
  orderItems: {
    name: string;
    qty: number;
    image: string;
    slug: string;
    price: number;
    description: string;
  }[];

  @IsNotEmptyObject(
    { nullable: false },
    { message: 'Property "shippingAddress" is required' },
  )
  @IsObject({ message: 'Property "shippingAddress" is of type object' })
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    number: number;
    state: string;
    country: string;
  };

  @IsNotEmpty({ message: 'Property "paymentMethod" is required' })
  @IsString({ message: 'Property "paymentMethod" is of type string' })
  paymentMethod: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Field "itemsPrice" is of type decimal(2)' },
  )
  @IsNotEmpty({ message: 'Field "itemsPrice" is required' })
  @IsPositive({ message: 'Field "itemsPrice" cannot be negative' })
  itemsPrice: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Field "shippingPrice" is of type decimal(2)' },
  )
  @IsNotEmpty({ message: 'Field "shippingPrice" is required' })
  @IsPositive({ message: 'Field "shippingPrice" cannot be negative' })
  shippingPrice: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Field "taxPrice" is of type decimal(2)' },
  )
  @IsNotEmpty({ message: 'Field "taxPrice" is required' })
  @IsPositive({ message: 'Field "taxPrice" cannot be negative' })
  taxPrice: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Field "totalPrice" is of type decimal(2)' },
  )
  @IsNotEmpty({ message: 'Field "totalPrice" is required' })
  @IsPositive({ message: 'Field "totalPrice" cannot be negative' })
  totalPrice: number;
}
