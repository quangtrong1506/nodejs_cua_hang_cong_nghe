import express from 'express';
import ChatController from '../../app/Http/Controllers/ChatController.mjs';
import IndexController from '../../app/Http/Controllers/IndexController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';

const chatRouter = (app) => {
    const router = express.Router();
    router.all('/', IndexController.index);
    //Todo: Get chat
    router.get('/user', authMiddleware, ChatController.getChatByUser);
    //Todo: Danh sách người dùng chat với admin
    router.get('/user-chat-with-admin', adminAuthMiddleware, ChatController.userChatWithAdmin);
    app.use('/chat', router);
};

export default chatRouter;
