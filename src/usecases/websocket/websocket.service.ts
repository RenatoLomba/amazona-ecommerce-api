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
    let room = null;

    const userHasRoom = await this.roomService.findOne({
      user: body.userId,
      isActive: true,
    });

    if (userHasRoom) {
      roomId = userHasRoom._id;
      data = { roomId, messages: userHasRoom.messages, user };
      room = userHasRoom;
    } else {
      const newRoom = await this.roomService.create(body.userId);
      roomId = newRoom._id;
      data = { roomId, messages: newRoom.messages, user };
      room = newRoom;
    }

    await client.join(String(roomId));

    client.broadcast.emit('user-entered', { room });

    return data;
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { adminId: string; roomId: string },
  ) {
    const { roomId, adminId } = body;
    const admin = await this.userService.findUnique({ _id: adminId });

    if (!admin) {
      return { error: 'Admin Not Found' };
    }

    if (!admin.isAdmin) {
      return { error: admin.name + ' is not Admin' };
    }

    const room = await this.roomService.findOne({
      isActive: true,
      _id: roomId,
    });

    if (!room) {
      return { error: 'Room Not Found' };
    }

    await this.roomService.adminJoin(roomId, adminId);

    await client.join(String(roomId));

    return { room };
  }

  @SubscribeMessage('show-rooms')
  async showRooms(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { adminId: string },
  ) {
    const { adminId } = body;
    const admin = await this.userService.findUnique({ _id: adminId });

    if (!admin) {
      return { error: 'Admin Not Found' };
    }

    if (!admin.isAdmin) {
      return { error: admin.name + ' is not Admin' };
    }

    const rooms = await this.roomService.findMany({
      isActive: true,
      admin: null,
    });

    return { rooms };
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
