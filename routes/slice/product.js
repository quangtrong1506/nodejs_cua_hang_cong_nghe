import express from 'express';
import ProductController from '../../app/Http/Controllers/ProductController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { validateAddProduct } from '../../app/Http/Requests/ProductRequest.mjs';

const productRouter = (app) => {
    const router = express.Router();
    router.get('/', ProductController.index);
    router.get('/search', ProductController.search);
    router.get('/count', adminAuthMiddleware, ProductController.count);
    router.get('/warning', adminAuthMiddleware, ProductController.warning);
    router.get('/:id', ProductController.show);
    router.post('/add', adminAuthMiddleware, validateAddProduct, ProductController.store);
    router.put('/:id', adminAuthMiddleware, validateAddProduct, ProductController.update);
    router.delete('/:id', adminAuthMiddleware, ProductController.destroy);
    app.use('/products', router);
};

export default productRouter;
