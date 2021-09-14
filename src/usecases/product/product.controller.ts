import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { ProductService } from 'src/usecases/product/product.service';
import { CreateProductDto } from './dto/create-product.dto';

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
    const products = await this.productService.findMany({});
    return { products: { count: products.length } };
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }
}
