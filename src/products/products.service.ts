import { Injectable } from '@nestjs/common';
import { Products } from './products.interface';

@Injectable()
export class ProductsService {
  listAllProducts(): Array<Products> {
    return [
      { name: 'biscoito', type: 'comida' },
      { name: 'bala', type: 'test' },
      { name: 'danone', type: 'test' },
    ];
  }
}
