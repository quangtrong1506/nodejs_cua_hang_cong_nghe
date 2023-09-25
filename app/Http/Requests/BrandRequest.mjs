import { stringToSlug } from '../../Common/helper.mjs';
import BrandRepository from '../../Repositories/BrandRepository.mjs';
import { baseRequest } from './BaseRequest.mjs';
import { body, param } from 'express-validator';

const validationAddBrand = [
    body('name').custom(async (name) => {
        if (!name) throw new Error('Tên hãng không được để trống');
        const check = await BrandRepository.findBy({
            slug: stringToSlug(name),
        });
        if (check.length > 0) throw new Error('Hãng đã tồn tại');
    }),
];
const validationUpdateBrand = [
    param('slug').custom(async (slug) => {
        const checkOld = await BrandRepository.findBy({
            slug,
        });
        if (checkOld.length === 0) throw new Error('Hãng không tồn tại');
    }),
    body('name').custom(async (name) => {
        if (!name) throw new Error('Tên hãng không được để trống');
        const checkNew = await BrandRepository.findBy({
            slug: stringToSlug(name),
        });
        if (checkNew.length > 0) throw new Error('Tên hãng mới đã tồn tại');
    }),
];

const validationDestroyBrand = [
    param('slug').custom(async (slug) => {
        const checkOld = await BrandRepository.findBy({
            slug,
        });
        if (checkOld.length === 0) throw new Error('Hãng không tồn tại');
    }),
];

export const validateAddBrand = baseRequest(validationAddBrand);
export const validateUpdateBrand = baseRequest(validationUpdateBrand);
export const validateDestroyBrand = baseRequest(validationDestroyBrand);
