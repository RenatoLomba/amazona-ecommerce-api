import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './usecases/auth/auth.module';
import { OrderModule } from './usecases/order/order.module';
import { ProductModule } from './usecases/product/product.module';
import { RoomModule } from './usecases/room/room.module';
import { UserModule } from './usecases/user/user.module';
import { WebSocketModule } from './usecases/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    ProductModule,
    AuthModule,
    OrderModule,
    RoomModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
