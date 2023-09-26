import mongoose from 'mongoose';
import {
    getProductSortOption,
    mongooseSlugGenerator,
    responseErrors,
    responseSuccess,
    stringToSlug,
} from '../../Common/helper.mjs';
import BrandRepository from '../../Repositories/BrandRepository.mjs';
import CategoryRepository from '../../Repositories/CategoryRepository.mjs';
import ProductRepository from '../../Repositories/ProductRepository.mjs';
import BaseController from './BaseController.mjs';
class CategoryController extends BaseController {
    async index(req, res) {
        try {
            const query = req.query.q;
            const category = req.query.cat;
            const page = parseInt(req.query.page) || 1;
            const sort = parseInt(req.query.sort) || 0;
            const limit = req.query.limit || 20;
            const sortOption = getProductSortOption(sort);
            const options = { sort: sortOption, limit, page };
            let CATS = [];
            let BRANDS = [];
            await Promise.all([
                CategoryRepository.findBy({}),
                BrandRepository.findBy({}),
            ]).then((value) => {
                CATS = value[0];
                BRANDS = value[1];
            });
            const findOption = {};
            if (sort == 2 || sort == 3) findOption.title = { $exists: true };
            if (query)
                findOption.slug = {
                    $regex: stringToSlug(query),
                };
            if (category) {
                const c = CATS.find(
                    (cat) => cat.slug === stringToSlug(category)
                );
                findOption.category = c?._id.toString();
            }
            const response = await ProductRepository.paginate(
                findOption,
                options
            );
            const products = response.docs;
            let newProduct = [];
            for (const product of products) {
                const cat = CATS.find(
                    (cat) => cat._id.toString() == product.category.toString()
                )?.name;
                const brand = BRANDS.find(
                    (brand) => brand._id.toString() == product.brand.toString()
                )?.name;
                const prod = {
                    ...product._doc,
                    id: product._id,
                    category: cat,
                    brand,
                };
                delete prod._id;
                newProduct.push(prod);
            }
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
            const status = parseInt(req.body.status);
            const brand = await BrandRepository.findBy({
                slug: req.body.brand,
            });
            const category = await CategoryRepository.findBy({
                slug: req.body.category,
            });
            const description = req.body.description;
            const images =
                typeof req.body.images === 'string'
                    ? JSON.parse(req.body.images)
                    : req.body.images;
            const thumbnail = req.body.thumbnail ?? images[0];
            const prod = await ProductRepository.store({
                title,
                slug,
                price,
                discount_percentage: discountPercentage,
                stock,
                status,
                brand: brand[0]?._id,
                category: category[0]?._id,
                description,
                images,
                thumbnail,
            });
            responseSuccess(res, prod);
        } catch (error) {
            responseErrors(res, 500, 'Lỗi tạo mới sản phẩm');
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            let oldProduct = [];
            if (mongoose.isValidObjectId(id)) {
                const p = await ProductRepository.findById(id);
                if (p) oldProduct.push(p);
            } else oldProduct = await ProductRepository.findBy({ slug: id });
            if (oldProduct.length === 0)
                return responseErrors(res, 401, 'Sản phẩm không tồn tại');
            const title = req.body.title;
            const slug = await mongooseSlugGenerator(ProductRepository, title);
            const price = parseInt(req.body.price);
            const discountPercentage = parseInt(req.body.discount_percentage);
            const stock = parseInt(req.body.stock);
            const status = parseInt(req.body.status);
            const brand = await BrandRepository.findBy({
                slug: req.body.brand,
            });
            const category = await CategoryRepository.findBy({
                slug: req.body.category,
            });
            const description = req.body.description;
            const images =
                typeof req.body.images === 'string'
                    ? JSON.parse(req.body.images)
                    : req.body.images;
            const thumbnail = req.body.thumbnail ?? images[0];

            const prod = await ProductRepository.update(oldProduct[0]._id, {
                title,
                slug,
                price,
                discount_percentage: discountPercentage,
                stock,
                status,
                brand: brand[0]?._id,
                category: category[0]?._id,
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
            let id = req.params?.id || '';
            if (!mongoose.isValidObjectId(id)) {
                const products = await ProductRepository.findBy({ slug: id });
                id = products[0]?._id;
            }
            const productDel = await ProductRepository.delete(id);
            if (productDel) responseSuccess(res, productDel);
            else return responseErrors(res, 404, 'Không tìm thấy sản phẩm');
        } catch (error) {
            console.log(error);
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

            let cat = null,
                brand = null;
            await Promise.all([
                CategoryRepository.findById(product.category),
                BrandRepository.findById(product.brand),
            ]).then((value) => {
                cat = value[0];
                brand = value[1];
            });
            responseSuccess(res, {
                id: product._id,
                category: cat?.name ?? '-',
                brand: brand?.name ?? '-',
                price: product.price,
                title: product.title,
                discount_percentage: product.discount_percentage,
                stock: product.stock,
                slug: product.slug,
                description: product.description,
                images: product.images,
                thumbnail: product.thumbnail,
                status: product.status,
            });
        } catch (error) {
            return responseErrors(res, 500, 'Lỗi show sản phẩm');
        }
    }
    async search(req, res) {
        try {
            const query = req.query.q;
            const slug = stringToSlug(query);
            const products = await ProductRepository.findBy({
                slug: { $regex: slug },
            });
            const data = {
                total: products?.length ?? 0,
                products: products,
            };
            responseSuccess(res, data);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.toString());
        }
    }
    async count(_req, res) {
        try {
            const data = await ProductRepository.count({});
            responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
    async warning(_req, res) {
        try {
            const data = await ProductRepository.count({
                amount: { $lt: 10 },
            });
            responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
}

export default new CategoryController();
