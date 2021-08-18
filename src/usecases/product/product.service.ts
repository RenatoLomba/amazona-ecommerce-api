import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    if (!product)
      throw new InternalServerErrorException('Error creating product');

    return product.save().catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
  }

  async findMany(params: FilterQuery<ProductDocument>): Promise<Product[]> {
    return this.productModel
      .find(params)
      .exec()
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
  }

  async findUnique({
    name,
    _id,
    slug,
  }: {
    _id?: string;
    name?: string;
    slug?: string;
  }): Promise<Product> {
    const product = await this.productModel
      .findOne({
        $or: [{ _id }, { name }, { slug }],
      })
      .catch((ex) => {
        throw new InternalServerErrorException(ex.message);
      });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
