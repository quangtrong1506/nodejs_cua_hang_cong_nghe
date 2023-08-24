import BaseController from './BaseController.mjs';
import {
    responseSuccess,
    responseErrors,
    stringToSlug,
} from '../../Common/helper.mjs';
import CategoryRepository from '../../Repositories/CategoryRepository.mjs';
import ProductRepository from '../../Repositories/ProductRepository.mjs';

class CategoryController extends BaseController {
    async index(_req, res) {
        const data = await CategoryRepository.findBy({});
        const result = [];
        data.forEach((element) => result.push(element.name));
        responseSuccess(res, result);
    }
    async store(req, res) {
        try {
            const name = req.body.name;
            CategoryRepository.store({
                name: name,
                slug: stringToSlug(name),
            });
            responseSuccess(res, {
                name: name,
                slug: stringToSlug(name),
            });
        } catch (error) {
            responseErrors(res, 500, 'Lỗi tạo mới danh mục');
        }
    }
    async update(req, res) {
        try {
            const slug = req.params.slug;
            const name = req.body.name;
            const cats = await CategoryRepository.findBy({
                slug,
            });
            await CategoryRepository.update(cats[0]._id, {
                name: name,
                slug: stringToSlug(name),
            });
            responseSuccess(res);
        } catch (error) {
            return responseErrors(res, 500, 'Lỗi cập nhật danh mục');
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
    async special(_req, res) {
        try {
            const data = await CategoryRepository.findBy({});
            const result = [];
            const forLoop = async (_) => {
                for (let index = 0; index < data.length; index++) {
                    const prod = await ProductRepository.findBy({
                        category: data[index]._id.toString(),
                    });
                    result.push({
                        name: data[index].name,
                        thumbnail: prod[0]?.thumbnail || null,
                    });
                }
                return responseSuccess(res, result);
            };
            forLoop();
        } catch (error) {
            responseErrors(res, 500, error.toString());
        }
    }
}

export default new CategoryController();
