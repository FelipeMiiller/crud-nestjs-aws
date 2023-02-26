import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './products.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  listAllProducts(): Array<Products> {
    return this.productService.listAllProducts();
  }
}
