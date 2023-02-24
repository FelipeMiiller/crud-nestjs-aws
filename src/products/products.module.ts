import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
