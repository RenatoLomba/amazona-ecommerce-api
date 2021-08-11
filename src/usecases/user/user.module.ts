import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/usecases/user/user.controller';
import { Crypto } from 'src/common/crypto';
import { UserService } from 'src/usecases/user/user.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, Crypto],
})
export class UserModule {}
