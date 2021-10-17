import { Module } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { RoomService } from '../room/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from '../room/room.entity';
import { User, UserSchema } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Crypto } from 'src/utils/crypto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [WebSocketService, RoomService, UserService, Crypto],
})
export class WebSocketModule {}
