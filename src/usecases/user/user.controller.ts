import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { CreateUserDto } from 'src/usecases/user/dto/create-user.dto';
import { UserService } from 'src/usecases/user/user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthAdminGuard)
  users() {
    return this.userService.findMany({});
  }

  @Get(':id')
  @UseGuards(AuthAdminGuard)
  user(@Param('id') _id: string) {
    return this.userService.findUnique({ _id });
  }

  @Get('/admin/count')
  @UseGuards(AuthAdminGuard)
  async userCount() {
    const users = await this.userService.findMany({});
    return { users: { count: users.length } };
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  updateUser(@Param('id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(_id, dto);
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  deleteUser(@Param('id') _id: string) {
    return this.userService.delete(_id);
  }
}
