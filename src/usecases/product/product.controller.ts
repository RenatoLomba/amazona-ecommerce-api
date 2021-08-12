import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { AuthUserGuard } from 'src/common/guards/auth-user.guard';
import { ProductService } from 'src/usecases/product/product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(AuthUserGuard)
  async products() {
    return this.productService.findMany({});
  }

  @Get(':id')
  @UseGuards(AuthUserGuard)
  async product(@Param('id') _id: string) {
    return this.productService.findUnique({ _id });
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }
}
