import express from 'express';
import NotificationController from '../../app/Http/Controllers/NotificationController.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';

const notificationRouter = (app) => {
    const router = express.Router();
    router.get('/', authMiddleware, NotificationController.show);
    app.use('/notifications', router);
};

export default notificationRouter;
