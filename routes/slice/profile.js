import express from 'express';
import ProfileController from '../../app/Http/Controllers/ProfileController.mjs';
import {
    validateProfileChangePassword,
    validateUpdateDetailUser,
} from '../../app/Http/Requests/ProfileRequest.mjs';

import { authMiddleware } from '../../app/Http/Middlewares/AuthMiddleware.mjs';
const profileRouter = (app) => {
    const router = express.Router();
    router.get('/', authMiddleware, ProfileController.show);
    router.post('/', validateUpdateDetailUser, authMiddleware, ProfileController.update);
    router.put(
        '/change-password',
        validateProfileChangePassword,
        authMiddleware,
        ProfileController.changePassword
    );
    app.use('/profile', router);
};

export default profileRouter;
