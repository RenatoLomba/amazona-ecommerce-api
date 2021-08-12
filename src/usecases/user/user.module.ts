import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/usecases/user/user.controller';
import { Crypto } from 'src/utils/crypto';
import { UserService } from 'src/usecases/user/user.service';
import { User, UserSchema } from './user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, Crypto],
  exports: [UserService],
})
export class UserModule {}
