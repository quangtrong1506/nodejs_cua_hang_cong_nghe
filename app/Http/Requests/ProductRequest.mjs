import { stringToSlug } from '../../Common/helper.mjs';
import CategoryRepository from '../../Repositories/CategoryRepository.mjs';
import { baseRequest } from './BaseRequest.mjs';
import { body, param } from 'express-validator';

const validationAddProduct = [
    body('title').custom(async (title) => {
        if (!title) throw new Error('Tên sản phẩm không được để trống');
    }),
    body('price').custom(async (price) => {
        if (!price) throw new Error('Giá sản phẩm không được để trống');
        if (price < 0) throw new Error('Giá của sản phẩm phải lớn hơn 0');
    }),
    body('stock').custom(async (stock) => {
        if (!stock) throw new Error('Số lượng sản phẩm không được để trống');
        if (stock < 0) throw new Error('Số lượng sản phẩm phải lớn hơn 0');
    }),
    body('status').custom(async (status) => {
        if (!status) throw new Error('Trạng thái sản phẩm không được để trống');
    }),
    body('brand').custom(async (brand) => {
        if (!brand) throw new Error('Hãng của sản phẩm không được để trống');
    }),
    body('category').custom(async (category) => {
        if (!category)
            throw new Error('Danh mục của sản phẩm không được để trống');
    }),
    body('description').custom(async (description) => {
        if (!description) throw new Error('Mô tả sản phẩm không được để trống');
    }),
    body('images').custom(async (images) => {
        if (!images) throw new Error('Ảnh sản phẩm không được để trống');
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

export const validateAddProduct = baseRequest(validationAddProduct);
export const validateUpdateCategory = baseRequest(validationUpdateCategory);
export const validateDestroyCategory = baseRequest(validationDestroyCategory);
