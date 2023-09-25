import BaseController from './BaseController.mjs';
import {
    responseSuccess,
    responseErrors,
    stringToSlug,
} from '../../Common/helper.mjs';
import BrandRepository from '../../Repositories/BrandRepository.mjs';

class BrandController extends BaseController {
    async index(_req, res) {
        const data = await BrandRepository.findBy({});
        const result = [];
        data.forEach((element) => result.push(element.name));
        responseSuccess(res, result);
    }
    async store(req, res) {
        try {
            const name = req.body.name;
            BrandRepository.store({
                name: name,
                slug: stringToSlug(name),
            });
            responseSuccess(res, {
                name: name,
                slug: stringToSlug(name),
            });
        } catch (error) {
            responseErrors(res, 500, 'Lỗi tạo mới hãng sản phẩm');
        }
    }
    async update(req, res) {
        try {
            const slug = req.params.slug;
            console.log(slug);
            const name = req.body.name;
            const brands = await BrandRepository.findBy({
                slug,
            });
            if (brands.length > 0)
                await BrandRepository.update(brands[0]._id, {
                    name: name,
                    slug: stringToSlug(name),
                });
            else
                return responseErrors(res, 404, 'Không tìm thấy hãng sản phẩm');
            responseSuccess(res);
        } catch (error) {
            return responseErrors(res, 500, error.message);
        }
    }
    async destroy(req, res) {
        try {
            const slug = req.params.slug;
            const brands = await BrandRepository.findBy({
                slug,
            });
            if (brands.length == 0)
                return responseErrors(res, 401, 'Hãng không tồn tại');
            console.log(brands);
            await BrandRepository.delete(brands[0]._id);
            return responseSuccess(res);
        } catch (error) {
            responseErrors(res, 500, 'Lỗi cập nhật hãng sản phẩm');
        }
    }
}

export default new BrandController();
