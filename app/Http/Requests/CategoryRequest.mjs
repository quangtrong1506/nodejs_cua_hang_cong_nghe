import { stringToSlug } from '../../Common/helper.mjs';
import CategoryRepository from '../../Repositories/CategoryRepository.mjs';
import { baseRequest } from './BaseRequest.mjs';
import { body, param } from 'express-validator';

const validationAddCategory = [
    body('name').custom(async (name) => {
        if (!name) throw new Error('Tên danh mục không được để trống');
        const check = await CategoryRepository.findBy({
            slug: stringToSlug(name),
        });
        if (check.length > 0) throw new Error('Danh mục đã tồn tại');
    }),
];
const validationUpdateCategory = [
    param('slug').custom(async (slug) => {
        const checkOld = await CategoryRepository.findBy({
            slug,
        });
        if (checkOld.length === 0) throw new Error('Danh mục không tồn tại');
    }),
    body('name').custom(async (name) => {
        if (!name) throw new Error('Tên danh mục không được để trống');
        const checkNew = await CategoryRepository.findBy({
            slug: stringToSlug(name),
        });
        if (checkNew.length > 0) throw new Error('Tên danh mục mới đã tồn tại');
    }),
];

const validationDestroyCategory = [
    param('slug').custom(async (slug) => {
        const checkOld = await CategoryRepository.findBy({
            slug,
        });
        if (checkOld.length === 0) throw new Error('Danh mục không tồn tại');
    }),
];

export const validateAddCategory = baseRequest(validationAddCategory);
export const validateUpdateCategory = baseRequest(validationUpdateCategory);
export const validateDestroyCategory = baseRequest(validationDestroyCategory);
