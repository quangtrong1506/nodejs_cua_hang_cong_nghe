import BaseRepository from './BaseRepository.mjs';
import Product from '../Models/Product.mjs';

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }
}

export default new ProductRepository();
// Sản phẩm
