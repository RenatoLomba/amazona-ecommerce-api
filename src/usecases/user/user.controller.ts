import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/usecases/user/dto/create-user.dto';
import { UserService } from 'src/usecases/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  users() {
    return this.userService.find({});
  }

  @Get(':id')
  user(@Param('id') _id: string) {
    return this.userService.findOne({ _id });
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') _id: string) {
    return this.userService.delete(_id);
  }
}
