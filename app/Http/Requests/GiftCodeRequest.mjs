import { body } from 'express-validator';
import { baseRequest } from './BaseRequest.mjs';

const validationAddGiftCode = [
    body('code').custom(async (code) => {
        if (code === null || code === undefined)
            throw new Error('Code không được để trống');
    }),
    body('type').custom(async (type) => {
        if (type === null || type === undefined)
            throw new Error('type không được để trống');
    }),
    body('status').custom(async (status) => {
        if (!status) throw new Error('Code được để trống');
    }),
    body('discount').custom(async (discount) => {
        if (!discount) throw new Error('Code được để trống');
    }),
];

export const validateAddGift = baseRequest(validationAddGiftCode);
