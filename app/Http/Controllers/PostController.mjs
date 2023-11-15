import mongoose from 'mongoose';
import { mongooseSlugGenerator, responseErrors, responseSuccess } from '../../Common/helper.mjs';
import PostRepository from '../../Repositories/PostRepository.mjs';
import BaseController from './BaseController.mjs';

class PostsController extends BaseController {
    async index(req, res) {
        try {
            const { limit, page } = req.query;
            const data = await PostRepository.paginate({}, { limit, page });
            responseSuccess(res, data);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async store(req, res) {
        try {
            const { title, content, thumbnail } = req.body;
            const data = await PostRepository.store({
                title,
                content,
                thumbnail,
                slug: await mongooseSlugGenerator(PostRepository, title),
            });
            responseSuccess(res, data.docs);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            const { title, content, thumbnail } = req.body;
            const data = await PostRepository.update(id, {
                title,
                content,
                thumbnail,
                slug: await mongooseSlugGenerator(PostRepository, title),
            });
            responseSuccess(res, data);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            console.log(id);
            let data = null;
            if (mongoose.isValidObjectId(id)) data = await PostRepository.findById(id);
            else data = await PostRepository.findOne({ slug: id });
            if (!data) responseErrors(res, 404, 'Bài viết không tồn tại');
            responseSuccess(res, data);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
}

export default new PostsController();
