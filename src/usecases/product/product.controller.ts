import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { ProductService } from 'src/usecases/product/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async products() {
    return this.productService.findMany({});
  }

  @Get(':slug')
  async product(@Param('slug') slug: string) {
    return this.productService.findUnique({ slug });
  }

  @Get('admin/count')
  @UseGuards(AuthAdminGuard)
  async productsCount() {
    const count = await this.productService.count();
    return { products: { count } };
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  async updateProduct(
    @Param('id') _id: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.update(_id, data);
  }
}
