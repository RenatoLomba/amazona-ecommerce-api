import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Room, RoomDocument } from './room.entity';

type Message = {
  senderId: string;
  senderName: string;
  message: string;
  sendTime: Date;
};

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async findOne(filter: FilterQuery<RoomDocument>) {
    return this.roomModel.findOne(filter);
  }

  async create(user: string) {
    const createdRoom = new this.roomModel({ user });
    if (!createdRoom)
      throw new InternalServerErrorException('Error creating room');

    return createdRoom.save().catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
  }

  async addMessage(_id: string, message: Message) {
    const room = await this.findOne({ _id });

    await this.roomModel
      .findByIdAndUpdate(
        _id,
        {
          messages: [...room.messages, { ...message }],
        },
        { useFindAndModify: false },
      )
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
  }
}