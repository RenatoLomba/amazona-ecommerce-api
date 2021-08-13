import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUserGuard } from 'src/common/guards/auth-user.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/user.entity';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Get()
  @UseGuards(AuthUserGuard)
  async validateToken() {
    return { isValid: true };
  }
}
