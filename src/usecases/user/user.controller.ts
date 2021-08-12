import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { CreateUserDto } from 'src/usecases/user/dto/create-user.dto';
import { UserService } from 'src/usecases/user/user.service';

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
