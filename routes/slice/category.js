import express from 'express';
import CategoryController from '../../app/Http/Controllers/CategoryController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import {
    validateAddCategory,
    validateDestroyCategory,
    validateUpdateCategory,
} from '../../app/Http/Requests/CategoryRequest.mjs';

const categoryRouter = (app) => {
    const router = express.Router();
    router.get('/', CategoryController.index); // get all categories
    router.post('/add', adminAuthMiddleware, validateAddCategory, CategoryController.store);
    router.put('/:slug', adminAuthMiddleware, validateUpdateCategory, CategoryController.update);
    router.delete(
        '/:slug',
        adminAuthMiddleware,
        validateDestroyCategory,
        CategoryController.destroy
    );
    router.get('/special', CategoryController.special);
    app.use('/category', router);
};

export default categoryRouter;
