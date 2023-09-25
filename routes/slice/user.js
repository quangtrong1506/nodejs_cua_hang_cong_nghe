import express from 'express';
import OrderController from '../../app/Http/Controllers/OrderController.mjs';
import UserController from '../../app/Http/Controllers/UserController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';

const userRouter = (app) => {
    const router = express.Router();
    router.get('/', adminAuthMiddleware, UserController.index);
    router.get('/count', adminAuthMiddleware, UserController.count);
    router.get('/orders', authMiddleware, OrderController.getListOrderByUser);
    router.get('/orders/:id', authMiddleware, OrderController.show);
    router.delete('/orders/:id', authMiddleware, OrderController.cancelOrder);
    app.use('/users', router);
};

export default userRouter;
