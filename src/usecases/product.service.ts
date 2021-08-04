import { Injectable } from '@nestjs/common';
import { data } from 'src/data';

@Injectable()
export class ProductService {
  findMany() {
    return data.products;
  }
}
