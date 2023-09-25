import express from 'express';
import MessageController from '../../app/Http/Controllers/MessageController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';

const messageRouter = (app) => {
    const router = express.Router();
    //Todo:User nhắn tin với admin
    router.post('/user-to-admin', authMiddleware, MessageController.userToAdmin);
    //Todo: Chỉnh trạng thái tin nhắn thành đã đọc
    router.put('/admin-read-message', adminAuthMiddleware, MessageController.readByAdmin);
    //Todo: Admin nhắn tin cho user
    router.post('/admin-to-user', adminAuthMiddleware, MessageController.adminToUser);
    //Todo: Lấy danh sách tin nhắn của user theo  chat_id
    router.get('/:id', authMiddleware, MessageController.getListMessage);
    //Todo: Lấy danh sách tin nhắn người dùng theo chat_id
    router.get('/user/:id', adminAuthMiddleware, MessageController.getListMessageByAdmin);
    app.use('/message', router);
};

export default messageRouter;
