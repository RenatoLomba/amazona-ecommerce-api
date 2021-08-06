import { Injectable, NotFoundException } from '@nestjs/common';
import { data } from 'src/data';

@Injectable()
export class ProductService {
  findMany() {
    return data.products;
  }

  findUnique(_id: string) {
    const product = data.products.find((product) => product._id === _id);
    if (!product) throw new NotFoundException();
    return product;
  }
}
