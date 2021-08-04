import { Controller, Get } from '@nestjs/common';
import { ProductService } from 'src/usecases/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { } // eslint-disable-line

  @Get()
  findAll() {
    return this.productService.findMany();
  }
}
