import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('/active')
  @UseGuards(AuthAdminGuard)
  async activeRooms() {
    return this.roomService.findMany({ isActive: true, admin: null });
  }
}
