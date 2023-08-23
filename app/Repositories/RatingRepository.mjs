import BaseRepository from './BaseRepository.mjs';
import rating from '../Models/Rating.mjs';

class RatingRepository extends BaseRepository {
    constructor() {
        super(rating);
    }
}

export default new RatingRepository();
// Danh mục sản phẩm
