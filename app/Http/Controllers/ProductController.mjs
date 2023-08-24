import BaseController from './BaseController.mjs';
import {
    responseSuccess,
    responseErrors,
    stringToSlug,
    mongooseSlugGenerator,
    getProductSortOption,
} from '../../Common/helper.mjs';
import CategoryRepository from '../../Repositories/CategoryRepository.mjs';
import ProductRepository from '../../Repositories/ProductRepository.mjs';
import RatingRepository from '../../Repositories/RatingRepository.mjs';
import mongoose from 'mongoose';
class CategoryController extends BaseController {
    async index(req, res) {
        try {
            const query = req.query.q;
            const category = req.query.cat;
            const page = parseInt(req.query.page) || 1;
            const sort = parseInt(req.query.sort) || 0;
            const limit = req.query.limit || 20;
            const skip = (page - 1) * limit;
            const sortOption = getProductSortOption(sort);
            const model = await ProductRepository.getModel();
            const findOption = {};
            if (sort == 2 || sort == 3) findOption.name = { $exists: true };
            if (query)
                findOption.slug = {
                    $regex: stringToSlug(query),
                    // $options: 'g',
                };
            if (category) {
                let cats = await CategoryRepository.findBy({ slug: category });
                if (cats.length > 0)
                    findOption.category = cats[0]._id.toString();
            }
            const products = await model
                .find(findOption)
                .limit(limit)
                .skip(skip)
                .sort(sortOption);
            const categories = await CategoryRepository.findBy({});
            let newProduct = [];
            products.forEach((product) => {
                const cat = categories.find(
                    (cat) => cat._id.toString() == product.category.toString()
                ).name;
                const prod = {
                    ...product._doc,
                    category: cat,
                };
                newProduct.push(prod);
            });
            const data = {
                limit,
                total: products?.length ?? 0,
                page,
                products: newProduct,
            };
            responseSuccess(res, data);
        } catch (error) {
            responseErrors(res, 500, error.toString());
        }
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
            if (!mongoose.isValidObjectId(id))
                return responseErrors(
                    res,
                    401,
                    'ID sản phẩm không đúng định dạng'
                );
            const oldProduct = await ProductRepository.findById(id);
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
            responseErrors(res, 500, 'Lỗi cập nhật sản phẩm');
        }
    }
    async destroy(req, res) {
        try {
            const id = req.params?.id || '';
            if (!mongoose.isValidObjectId(id))
                return responseErrors(
                    res,
                    401,
                    'ID sản phẩm không đúng định dạng'
                );
            await ProductRepository.delete(id);
            responseSuccess(res);
        } catch (error) {
            return responseErrors(res, 500, 'Lỗi xoá sản phẩm');
        }
    }
    async show(req, res) {
        try {
            const id = req.params?.id || '';
            let product = {};
            if (mongoose.isValidObjectId(id)) {
                const prod = await ProductRepository.findById(id);
                if (prod) product = prod;
            } else {
                const products = await ProductRepository.findBy({ slug: id });
                if (products.length > 0) product = products[0];
            }
            if (Object.entries(product).length === 0)
                return responseErrors(res, 404, 'Không tìm thấy sản phẩm');
            responseSuccess(res, product);
        } catch (error) {
            return responseErrors(res, 500, 'Lỗi show sản phẩm');
        }
    }
}

export default new CategoryController();
