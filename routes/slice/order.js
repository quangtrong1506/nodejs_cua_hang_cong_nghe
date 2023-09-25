import express from 'express';
import OrderController from '../../app/Http/Controllers/OrderController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';
import { validateAddOrder } from '../../app/Http/Requests/OrdersRequest.mjs';

const orderRouter = (app) => {
    const router = express.Router();
    router.get('/', adminAuthMiddleware, OrderController.index);
    router.post('/', authMiddleware, validateAddOrder, OrderController.store);
    router.get('/count', adminAuthMiddleware, OrderController.count);
    router.get('/:id', adminAuthMiddleware, OrderController.show);
    app.use('/orders', router);
};

export default orderRouter;
