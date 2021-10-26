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

  @Get('/innactive')
  @UseGuards(AuthAdminGuard)
  async innactiveRooms(@CurrentUser() user: UserDocument) {
    return this.roomService.findMany({ isActive: false, admin: user._id });
  }

  @Put('/finish/:id')
  @UseGuards(AuthAdminGuard)
  async finishRoom(@Param('id') _id: string) {
    return this.roomService.finishRoom(_id);
  }
}
