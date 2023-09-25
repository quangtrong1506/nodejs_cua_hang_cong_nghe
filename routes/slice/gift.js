import express from 'express';
import GiftCodeController from '../../app/Http/Controllers/GiftCodeController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';
import { validateAddGift } from '../../app/Http/Requests/GiftCodeRequest.mjs';

const giftRouter = (app) => {
    const router = express.Router();
    router.get('/:code', authMiddleware, GiftCodeController.get);
    router.get('/', adminAuthMiddleware, GiftCodeController.show);
    router.post(
        '/',
        adminAuthMiddleware,
        validateAddGift,
        GiftCodeController.add
    );
    app.use('/gifts', router);
};

export default giftRouter;
