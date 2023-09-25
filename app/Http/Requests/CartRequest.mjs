import mongoose from 'mongoose';
import { baseRequest } from './BaseRequest.mjs';
import { body } from 'express-validator';

const validationUpdateCart = [
    body('productId').custom(async (id) => {
        if (!id) throw new Error('ID không được để trống');
        if (!mongoose.isValidObjectId(id)) throw new Error('ID không hợp lệ');
    }),
    body('quantity').custom(async (quantity) => {
        if (!quantity) throw new Error('Số lượng không được để trống');
        if (typeof quantity !== 'number')
            throw new Error('Số lượng phải là kiểu số');
    }),
];

export const validateAddCart = baseRequest(validationUpdateCart);
