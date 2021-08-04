import { Module } from '@nestjs/common';
import { ProductController } from 'src/adapters/controllers/product.controller';
import { ProductService } from 'src/usecases/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { } // eslint-disable-line
