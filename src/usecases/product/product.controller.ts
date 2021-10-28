import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthAdminGuard } from 'src/common/guards/auth-admin.guard';
import { ProductService } from 'src/usecases/product/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Readable } from 'stream';

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

  @Post('upload')
  @UseGuards(AuthAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
      api_key: process.env.CLOUDNARY_API_KEY,
      api_secret: process.env.CLOUDNARY_API_SECRET,
    };

    cloudinary.config(cloudinaryConfig);

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        const readableStream = new Readable();
        readableStream._read = (size) => {
          console.log(size);
        };
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(stream);
      });
    };
    const result = await streamUpload();

    return result;
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
