import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';

@WebSocketGateway(0, {
  namespace: 'room',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class WebSocketService implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  handleConnection() {}

  @SubscribeMessage('enter-room')
  async enterRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { userId: string },
  ) {
    const user = await this.userService.findUnique({ _id: body.userId });

    let data: any = null;
    let roomId = '';

    const userHasRoom = await this.roomService.findOne({
      user: body.userId,
      isActive: true,
    });

    if (userHasRoom) {
      roomId = userHasRoom._id;
      data = { roomId, messages: userHasRoom.messages, user };
    } else {
      const newRoom = await this.roomService.create(body.userId);
      roomId = newRoom._id;
      data = { roomId, messages: newRoom.messages, user };
    }

    client.join(roomId);

    client.broadcast.to(roomId).emit('user-entered', data);

    return data;
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: { id: string; message: string; name: string; roomId: string },
  ) {
    const { roomId } = body;
    const newMessage = {
      senderId: body.id,
      message: body.message,
      senderName: body.name,
      sendTime: new Date(),
    };
    await this.roomService.addMessage(roomId, newMessage);

    client.broadcast.to(roomId).emit('receive-message', { newMessage });

    return { newMessage };
  }
}
