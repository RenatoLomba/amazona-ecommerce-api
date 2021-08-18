import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & mongoose.Document;

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

  @Prop({ default: 0, max: 5.0, type: mongoose.Schema.Types.Number })
  rating: number;

  @Prop({ default: 0 })
  numReviews: number;

  @Prop()
  description: string;

  @Prop({ unique: true })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
