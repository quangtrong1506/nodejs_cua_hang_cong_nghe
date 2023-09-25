import { baseRequest } from './BaseRequest.mjs';
import { body } from 'express-validator';

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

export const validateAddProduct = baseRequest(validationAddProduct);
