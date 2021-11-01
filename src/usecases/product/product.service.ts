import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async count() {
    return this.productModel.countDocuments();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    if (!product)
      throw new InternalServerErrorException('Error creating product');

    return product.save().catch((ex) => {
      throw new InternalServerErrorException(ex.message);
    });
  }

  async update(_id: string, data: UpdateProductDto): Promise<void> {
    await this.productModel
      .findByIdAndUpdate(_id, { ...data }, { useFindAndModify: false })
      .catch((ex) => {
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

  async delete(_id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(_id, { useFindAndModify: false });
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
