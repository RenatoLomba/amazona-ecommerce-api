import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUserGuard } from 'src/common/guards/auth-user.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User, UserDocument } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async signUp(@Body() data: CreateUserDto) {
    const auth = await this.authService.registerUser(data);
    auth.user.password = undefined;
    return auth;
  }

  @Post('login')
  async signIn(@Body() data: AuthDto): Promise<Auth> {
    const auth = await this.authService.validateUser(data);
    auth.user.password = undefined;
    return auth;
  }

  @Put('update')
  @UseGuards(AuthUserGuard)
  async updateUserInfo(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateUserDto,
  ) {
    const userUpdated = await this.userService.update(user._id, data);
    const token = await this.authService.generateToken(userUpdated);

    return { user: userUpdated, token };
  }

  @Get()
  @UseGuards(AuthUserGuard)
  async validateToken(@CurrentUser() user: User) {
    user.password = undefined;
    return { isValid: true, user };
  }
}
