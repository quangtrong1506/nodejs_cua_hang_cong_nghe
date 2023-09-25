import { baseRequest } from './BaseRequest.mjs';
import { body } from 'express-validator';

const validationsAdminLogin = [
    body('email').custom(async (email) => {
        if (typeof email !== 'string') {
            throw new Error('Email phải là kiểu chuỗi');
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            throw new Error('Email không đúng định dạng');
    }),
    body('password').custom(async (passwordValue) => {
        if (typeof passwordValue !== 'string') {
            throw new Error('Mật khẩu phải là kiểu chuỗi');
        }
    }),
];

export const validateAdminLogin = baseRequest(validationsAdminLogin);
