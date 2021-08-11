import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ unique: true })
  name: string;

  @Prop()
  category: string;

  @Prop()
  image: string;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  countInStock: number;

  @Prop()
  brand: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  numReviews: number;

  @Prop()
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
