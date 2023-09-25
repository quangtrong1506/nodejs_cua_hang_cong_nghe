import express from 'express';
import AuthController from '../../app/Http/Controllers/AuthController.mjs';
import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';
import {
    validateChangePassword,
    validateUserLogin,
    validateUserStore,
} from '../../app/Http/Requests/AuthRequest.mjs';

const authRouter = (app) => {
    const router = express.Router();
    router.post('/login', validateUserLogin, AuthController.login);
    router.post(
        '/change-password',
        validateChangePassword,
        authMiddleware,
        AuthController.changePassword
    );
    router.post('/register', validateUserStore, AuthController.store);
    app.use('/auth', router);
};

export default authRouter;
