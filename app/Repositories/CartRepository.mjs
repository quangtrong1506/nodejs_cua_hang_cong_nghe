import BaseRepository from './BaseRepository.mjs';
import Cart from '../Models/Cart.mjs';

class CartRepository extends BaseRepository {
    constructor() {
        super(Cart);
    }
}

export default new CartRepository();
// Sản phẩm
