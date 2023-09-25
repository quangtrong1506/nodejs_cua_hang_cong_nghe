import express from 'express';
import CartController from '../../app/Http/Controllers/CartController.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';
import { validateAddCart } from '../../app/Http/Requests/CartRequest.mjs';
const cartRouter = (app) => {
    const router = express.Router();
    router.get('/', authMiddleware, CartController.index);
    router.post('/', authMiddleware, validateAddCart, CartController.update);
    router.put('/', authMiddleware, validateAddCart, CartController.set);
    router.delete('/:id', authMiddleware, CartController.removeProduct);
    app.use('/carts', router);
};

export default cartRouter;
