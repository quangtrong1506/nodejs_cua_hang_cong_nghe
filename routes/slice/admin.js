import express from 'express';
import AdminAuthController from '../../app/Http/Controllers/AdminAuthController.mjs';
import AdminController from '../../app/Http/Controllers/AdminController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { validateAdminLogin } from '../../app/Http/Requests/AdminAuthRequest.mjs';
import { validateStoreOrUpdateAdmin } from '../../app/Http/Requests/AdminRequest.mjs';

const adminRouter = (app) => {
    const router = express.Router();
    router.post('/login', validateAdminLogin, AdminAuthController.login);
    router.post('/', validateStoreOrUpdateAdmin, AdminController.store);
    router.get('/profile', adminAuthMiddleware, AdminController.myInfo);
    router.get('/profile/:id', AdminController.show);
    app.use('/admin', router);
};

export default adminRouter;
