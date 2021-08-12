import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserDocument } from 'src/usecases/user/user.entity';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(
  Strategy,
  'jwt-user-strategy',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ sub }: { sub: UserDocument['_id'] }) {
    const user = await this.userService.findUnique({ _id: sub });

    if (!user) throw new UnauthorizedException('User not auth');

    return user;
  }
}
