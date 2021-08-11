import { Module } from '@nestjs/common';
import { ProductController } from 'src/usecases/product/product.controller';
import { ProductService } from 'src/usecases/product/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
