import { body } from 'express-validator';
import { baseRequest } from './BaseRequest.mjs';

const validationAddPosts = [
    body('title').custom(async (title) => {
        if (!title) throw new Error('Tiêu đề không được để trống');
    }),
    body('content').custom(async (content) => {
        if (!content) throw new Error('Nội dung không được để trống');
    }),
    body('thumbnail').custom(async (thumbnail) => {
        if (!thumbnail) throw new Error('Ảnh đại diện không được để trống');
    }),
];

export const validateAddPost = baseRequest(validationAddPosts);
