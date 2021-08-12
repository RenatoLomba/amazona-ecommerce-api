import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { UserDocument } from 'src/usecases/user/user.entity';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  'jwt-admin-strategy',
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
    if (!user.isAdmin) throw new UnauthorizedException('Only Admin permitted');

    return user;
  }
}
