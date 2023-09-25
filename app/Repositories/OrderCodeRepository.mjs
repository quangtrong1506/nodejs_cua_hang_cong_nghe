import Order from '../Models/Order.mjs';
import BaseRepository from './BaseRepository.mjs';

class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }
}

export default new OrderRepository();
