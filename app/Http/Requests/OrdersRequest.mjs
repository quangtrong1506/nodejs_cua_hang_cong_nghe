import { body } from 'express-validator';
import GiftCodeRepository from '../../Repositories/GiftCodeRepository.mjs';
import { baseRequest } from './BaseRequest.mjs';

const validationAddOrders = [
    body('products').custom(async (products) => {
        if (products.length == 0) throw new Error('Sản phẩm trống');
    }),
    body('address').custom(async (address) => {
        if (address.provinces === -1)
            throw new Error('provinces không được để trống');
        if (address.districts === -1)
            throw new Error('districts không được để trống');
        if (address.wards === -1) throw new Error('wards không được để trống');
    }),
    body('gift_code').custom(async (code) => {
        try {
            if (code) {
                const gifts = await GiftCodeRepository.findBy({
                    code,
                });
                if (gifts?.[0]) {
                    const gift = gifts?.[0];
                    const time = gift.status.time;
                    if (new Date(time.start) > new Date())
                        throw new Error('GiftCode không hợp lệ');
                    if (new Date(time.end) < new Date())
                        throw new Error('GiftCode đã hết hạn');
                } else throw new Error('GiftCode không đúng');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }),
];

export const validateAddOrder = baseRequest(validationAddOrders);
