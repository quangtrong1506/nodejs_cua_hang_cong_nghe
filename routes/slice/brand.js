import express from 'express';
import BrandController from '../../app/Http/Controllers/BrandController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import {
    validateAddBrand,
    validateDestroyBrand,
    validateUpdateBrand,
} from '../../app/Http/Requests/BrandRequest.mjs';

const brandRouter = (app) => {
    const router = express.Router();
    router.get('/', BrandController.index);
    router.post('/add', adminAuthMiddleware, validateAddBrand, BrandController.store);
    router.put('/:slug', adminAuthMiddleware, validateUpdateBrand, BrandController.update);
    router.delete('/:slug', adminAuthMiddleware, validateDestroyBrand, BrandController.destroy);
    app.use('/brand', router);
};

export default brandRouter;
