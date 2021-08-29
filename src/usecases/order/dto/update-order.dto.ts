import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsBoolean({ message: 'Property "isPaid" is a bool type' })
  @IsOptional()
  isPaid?: boolean;

  @IsDateString({}, { message: 'Property "paidAt" is a Date type' })
  @IsOptional()
  paidAt?: Date;

  @IsBoolean({ message: 'Property "isDelivered" is a bool type' })
  @IsOptional()
  isDelivered?: boolean;

  @IsDateString({}, { message: 'Property "paidAt" is a Date type' })
  @IsOptional()
  deliveredAt?: Date;
}
