import express from 'express';

// Controllers
import UserController from '../app/Http/Controllers/UserController.mjs';
import AuthController from '../app/Http/Controllers/AuthController.mjs';
import ProfileController from '../app/Http/Controllers/ProfileController.mjs';

// Requests
import {
    validateStoreOrUpdateUser,
    validateIndexUser,
} from '../app/Http/Requests/UserRequest.mjs';
import {
    validateUserLogin,
    validateConfirmAccount,
    validateChangePassword,
} from '../app/Http/Requests/AuthRequest.mjs';
import {
    validateUpdateDetailUser,
    validateProfileChangePassword,
} from '../app/Http/Requests/ProfileRequest.mjs';

// Middlewares
// import { authMiddleware } from '../app/Http/Middlewares/AuthMiddleware.mjs';
import { adminAuthMiddleware } from '../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { importUserMiddleware } from '../app/Http/Middlewares/ImportUserMiddleware.mjs';
import { updateProfileMiddleware } from '../app/Http/Middlewares/UpdateProfileMiddleware.mjs';
import CategoryController from '../app/Http/Controllers/CategoryController.mjs';
import {
    validateAddCategory,
    validateDestroyCategory,
    validateUpdateCategory,
} from '../app/Http/Requests/CategoryRequest.mjs';
import ProductController from '../app/Http/Controllers/ProductController.mjs';
import { validateAddProduct } from '../app/Http/Requests/ProductRequest.mjs';

const router = express.Router();

// Auth
router.post('/auth/login', validateUserLogin, AuthController.login);
router.post(
    '/auth/confirm-account',
    validateConfirmAccount,
    AuthController.confirmAccount
);
router.post(
    '/auth/confirm-account/change-password',
    validateChangePassword,
    AuthController.changePassword
);

// Users
// router.use(authMiddleware);
router.get('/users', UserController.index);
router.post('/users', validateStoreOrUpdateUser, UserController.store);
router.get('/users/:userId', UserController.show);
router.put('/users/:userId', validateStoreOrUpdateUser, UserController.update);
router.delete('/users/:userId', UserController.destroy);
router.post(
    '/users/import',
    importUserMiddleware.single('file'),
    UserController.import
);
router.get('/users/import/newest', UserController.showImportNewest);
router.get('/users/import/history', UserController.getImportHistory);
router.post('/users/export', validateIndexUser, UserController.export);

// Profile
router.get('/profile', ProfileController.show);
router.post(
    '/profile',
    updateProfileMiddleware.single('avatar'),
    validateUpdateDetailUser,
    ProfileController.update
);
router.put(
    '/profile/change-password',
    validateProfileChangePassword,
    ProfileController.changePassword
);
// category
router.get('/category', CategoryController.index); // get all categories
router.post(
    '/category/add',
    // adminAuthMiddleware,
    validateAddCategory,
    CategoryController.store
);
router.put(
    '/category/:slug',
    // adminAuthMiddleware,
    validateUpdateCategory,
    CategoryController.update
);
router.delete(
    '/category/:slug',
    // adminAuthMiddleware,
    validateDestroyCategory,
    CategoryController.destroy
);
router.get('/category/special', CategoryController.special);

// product
router.get('/products', ProductController.index);
router.post(
    '/products/add',
    // adminAuthMiddleware,
    validateAddProduct,
    ProductController.store
);
router.put(
    '/products/:id',
    // adminAuthMiddleware,
    validateAddProduct,
    ProductController.update
);

export default router;
