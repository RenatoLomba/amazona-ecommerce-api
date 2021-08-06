import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from 'src/usecases/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { } // eslint-disable-line

  @Get()
  findAll() {
    return this.productService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.productService.findUnique(_id);
  }
}
