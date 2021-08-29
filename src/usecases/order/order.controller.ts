import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUserGuard } from 'src/common/guards/auth-user.guard';
import { UserDocument } from '../user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(AuthUserGuard)
  async createOrder(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateOrderDto,
  ) {
    return this.orderService.create({ user: user._id, ...data });
  }

  @Get(':id')
  @UseGuards(AuthUserGuard)
  async getUserOrder(
    @CurrentUser() user: UserDocument,
    @Param('id') _id: string,
  ) {
    const order = await this.orderService.findUnique(_id);

    if (String(order.user) !== String(user._id)) {
      throw new UnauthorizedException('Only user owner can see this order');
    }

    return order;
  }

  @Get()
  @UseGuards(AuthUserGuard)
  async getUserOrders(@CurrentUser() user: UserDocument) {
    return this.orderService.findMany({ user: user._id });
  }

  @Put(':id')
  @UseGuards(AuthUserGuard)
  async updateOrderStatus(
    @CurrentUser() user: UserDocument,
    @Param('id') _id: string,
    @Body() data: UpdateOrderDto,
  ) {
    const order = await this.orderService.findUnique(_id);

    if (String(order.user) !== String(user._id)) {
      throw new UnauthorizedException('Only user owner can update this order');
    }

    return this.orderService.update(_id, { ...data });
  }

  @Delete(':id')
  @UseGuards(AuthUserGuard)
  async deleteUserOrder(
    @CurrentUser() user: UserDocument,
    @Param('id') _id: string,
  ) {
    const order = await this.orderService.findUnique(_id);

    if (String(order.user) !== String(user._id)) {
      throw new UnauthorizedException('Only user owner can delete this order');
    }

    return this.orderService.delete(_id);
  }
}
