import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  admin?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([
    {
      senderId: mongoose.Schema.Types.String,
      sendTime: mongoose.Schema.Types.Date,
      senderName: mongoose.Schema.Types.String,
      message: mongoose.Schema.Types.String,
    },
  ])
  messages: {
    senderId: string;
    sendTime: Date;
    senderName: string;
    message: string;
  }[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
