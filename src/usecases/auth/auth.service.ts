import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Crypto } from 'src/utils/crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Auth } from './auth.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private crypto: Crypto,
  ) {}

  async validateUser(data: AuthDto): Promise<Auth> {
    const user = await this.userService.findUnique({ email: data.email });

    const passwordIsCorrect = await this.crypto.validate(
      data.password,
      user.password,
    );

    if (!passwordIsCorrect)
      throw new UnauthorizedException('Incorrect Password');

    const token = await this.generateToken(user);

    return { user, token };
  }

  async registerUser(data: CreateUserDto): Promise<Auth> {
    const user = await this.userService.create(data);

    const token = await this.generateToken(user);

    return { user, token };
  }

  async generateToken(user: UserDocument): Promise<string> {
    const payload = { username: user.name, email: user.email, sub: user._id };
    return this.jwtService.signAsync(payload);
  }
}
