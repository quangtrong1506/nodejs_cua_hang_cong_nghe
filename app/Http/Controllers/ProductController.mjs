import BaseController from './BaseController.mjs';
import {
    responseSuccess,
    responseErrors,
    stringToSlug,
    mongooseSlugGenerator,
} from '../../Common/helper.mjs';
import CategoryRepository from '../../Repositories/CategoryRepository.mjs';
import ProductRepository from '../../Repositories/ProductRepository.mjs';
import RatingRepository from '../../Repositories/RatingRepository.mjs';

class CategoryController extends BaseController {
    async index(_req, res) {
        const data = await ProductRepository.findBy({});
        responseSuccess(res, data);
    }
    async store(req, res) {
        try {
            const title = req.body.title;
            const slug = await mongooseSlugGenerator(ProductRepository, title);
            const price = parseInt(req.body.price);
            const discountPercentage = parseFloat(req.body.discount_percentage);
            const stock = parseInt(req.body.stock);
            const status = req.body.status;
            const brand = req.body.brand;
            const category = req.body.category;
            const description = req.body.description;
            const images = JSON.parse(req.body.images);
            const thumbnail = JSON.parse(req.body.images)[0];
            const rating = await RatingRepository.store({});
            const prod = await ProductRepository.store({
                title,
                slug,
                price,
                discountPercentage,
                stock,
                status,
                brand,
                category,
                description,
                images,
                thumbnail,
                rating: rating._id,
            });
            responseSuccess(res, prod);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, 'Lỗi tạo mới sản phẩm');
        }
    }
    async update(req, res) {
        try {
            const id = req.params?.id || '';
            const title = req.body.title;
            const slug = await mongooseSlugGenerator(ProductRepository, title);
            const price = parseInt(req.body.price);
            const discountPercentage = parseFloat(req.body.discount_percentage);
            const stock = parseInt(req.body.stock);
            const status = req.body.status;
            const brand = req.body.brand;
            const category = req.body.category;
            const description = req.body.description;
            const images = JSON.parse(req.body.images);
            const thumbnail = JSON.parse(req.body.images)[0];
            const oldProduct = await ProductRepository.findBy({ slug });
            if (oldProduct.length === 0)
                return responseErrors(res, 401, 'Sản phẩm không tồn tại');
            const prod = await ProductRepository.update(id, {
                title,
                slug,
                price,
                discountPercentage,
                stock,
                status,
                brand,
                category,
                description,
                images,
                thumbnail,
            });
            responseSuccess(res, prod);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, 'Lỗi tạo mới sản phẩm');
        }
    }
    async destroy(req, res) {
        try {
            const slug = req.params.slug;
            const cats = await CategoryRepository.findBy({
                slug,
            });
            await CategoryRepository.delete(cats[0]._id);
            return responseSuccess(res);
        } catch (error) {
            return responseErrors(res, 500, 'Lỗi cập nhật danh mục');
        }
    }
}

export default new CategoryController();
