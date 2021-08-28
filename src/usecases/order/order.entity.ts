import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type OrderDocument = Order & mongoose.Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop([
    {
      name: mongoose.Schema.Types.String,
      qty: mongoose.Schema.Types.Number,
      image: mongoose.Schema.Types.String,
      price: mongoose.Schema.Types.Number,
    },
  ])
  orderItems: { name: string; qty: number; image: string; price: number }[];

  @Prop({
    type: {
      fullName: mongoose.Schema.Types.String,
      address: mongoose.Schema.Types.String,
      city: mongoose.Schema.Types.String,
      postalCode: mongoose.Schema.Types.String,
      country: mongoose.Schema.Types.String,
    },
  })
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };

  paymentMethod: string;

  itemsPrice: number;

  shippingPrice: number;

  taxPrice: number;

  totalPrice: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ default: false })
  isDelivered: boolean;

  paidAt: Date;

  deliveredAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);