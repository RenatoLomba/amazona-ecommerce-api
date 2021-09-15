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
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { AuthUserGuard } from 'src/common/guards/auth-user.guard';
import { UserDocument } from '../user/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
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

  @Get('/admin/count')
  @UseGuards(AuthAdminGuard)
  async ordersCount() {
    const count = await this.orderService.count();
    return { orders: { count } };
  }

  @Get('/admin/all')
  @UseGuards(AuthAdminGuard)
  async orders() {
    return this.orderService.findMany({});
  }

  @Get('/admin/total')
  @UseGuards(AuthAdminGuard)
  async ordersTotal() {
    const total = await this.orderService.ordersTotalPrice();
    return { orders: { total } };
  }

  @Get('/admin/sales')
  @UseGuards(AuthAdminGuard)
  async salesData() {
    const salesData = await this.orderService.salesData();
    return { orders: { salesData } };
  }

  @Put(':id/pay')
  @UseGuards(AuthUserGuard)
  async payOrder(@CurrentUser() user: UserDocument, @Param('id') _id: string) {
    const order = await this.orderService.findUnique(_id);

    if (String(order.user) !== String(user._id)) {
      throw new UnauthorizedException('Only user owner can pay this order');
    }

    return this.orderService.update(_id, { isPaid: true, paidAt: new Date() });
  }

  @Put(':id/deliver')
  @UseGuards(AuthUserGuard)
  async deliverOrder(
    @CurrentUser() user: UserDocument,
    @Param('id') _id: string,
  ) {
    const order = await this.orderService.findUnique(_id);

    if (String(order.user) !== String(user._id)) {
      throw new UnauthorizedException('Only user owner can pay this order');
    }

    return this.orderService.update(_id, {
      isDelivered: true,
      deliveredAt: new Date(),
    });
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
