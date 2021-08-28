import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(data: { user: string } & CreateOrderDto) {
    const order = new this.orderModel(data);

    if (!order) throw new InternalServerErrorException('Error creating order');

    return order.save().catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
  }

  async findUnique(_id: string) {
    const order = await this.orderModel.findById(_id).catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });

    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  async findMany(params: FilterQuery<OrderDocument>) {
    return this.orderModel
      .find(params)
      .exec()
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
  }

  async delete(_id: string) {
    return this.orderModel.findByIdAndDelete(_id);
  }
}
