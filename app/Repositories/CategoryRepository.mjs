import BaseRepository from './BaseRepository.mjs';
import Category from '../Models/Category.mjs';

class CategoryRepository extends BaseRepository {
    constructor() {
        super(Category);
    }
}

export default new CategoryRepository();
// Danh mục sản phẩm
