import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { UserDocument } from '../user/user.entity';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('/active')
  @UseGuards(AuthAdminGuard)
  async activeRooms() {
    return this.roomService.findMany({ isActive: true, admin: null });
  }

  @Get('/get_by/:id')
  @UseGuards(AuthAdminGuard)
  async getRoom(@Param('id') _id: string) {
    return this.roomService.findOne({ _id });
  }

  @Get('/innactive')
  @UseGuards(AuthAdminGuard)
  async innactiveRooms(@CurrentUser() user: UserDocument) {
    const rooms = await this.roomService.findMany({
      isActive: false,
      admin: user._id,
    });
    return rooms.filter((r) => r.user !== null);
  }

  @Put('/finish/:id')
  @UseGuards(AuthAdminGuard)
  async finishRoom(@Param('id') _id: string) {
    return this.roomService.finishRoom(_id);
  }
}
