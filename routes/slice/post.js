import express from 'express';
import PostController from '../../app/Http/Controllers/PostController.mjs';
import { adminAuthMiddleware } from '../../app/Http/Middlewares/AdminAuthMiddleware.mjs';
import { validateAddPost } from '../../app/Http/Requests/PostsRequest.mjs';

const postsRouter = (app) => {
    const router = express.Router();
    router.post(
        '/',
        adminAuthMiddleware,
        validateAddPost,
        PostController.store
    );
    router.put(
        '/:id',
        adminAuthMiddleware,
        validateAddPost,
        PostController.update
    );
    router.get('/', PostController.index);
    router.get('/:id', PostController.show);
    app.use('/posts', router);
};

export default postsRouter;
