import BaseRepository from './BaseRepository.mjs';
import Brand from '../Models/Brand.mjs';

class BrandRepository extends BaseRepository {
    constructor() {
        super(Brand);
    }
}

export default new BrandRepository();
// Hãng
