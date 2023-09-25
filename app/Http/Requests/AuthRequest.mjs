import { baseRequest } from './BaseRequest.mjs';
import { body } from 'express-validator';

const validationsUserLogin = [
    body('email').custom(async (nameValue) => {
        if (typeof nameValue !== 'string') {
            throw new Error('Email phải là kiểu chuỗi');
        }
    }),
    body('password').custom(async (passwordValue) => {
        if (typeof passwordValue !== 'string') {
            throw new Error('Mật khẩu phải là kiểu chuỗi');
        }
    }),
];
const validationsUserStore = [
    body('email').custom(async (value) => {
        if (typeof value !== 'string') {
            throw new Error('Email phải là kiểu chuỗi');
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            throw new Error('Email không đúng định dạng');
        }
    }),
    body('password').custom(async (passwordValue) => {
        if (typeof passwordValue !== 'string') {
            throw new Error('Mật khẩu phải là kiểu chuỗi');
        }
        if (passwordValue.length < 6 || passwordValue.length > 20) {
            throw new Error('Mật khẩu phải từ 6-20 ký tự');
        }
    }),
    body('confirm').custom(async (passwordValue) => {
        if (typeof passwordValue !== 'string') {
            throw new Error('Xác nhận mật khẩu phải là kiểu chuỗi');
        }
        if (passwordValue.length < 6 || passwordValue.length > 20) {
            throw new Error('Xác nhận mật khẩu phải từ 6-20 ký tự');
        }
    }),
];

const validationChangePassword = [
    body('newPassword').custom(async (passwordValue) => {
        if (typeof passwordValue !== 'string') {
            throw new Error('Mật khẩu phải là kiểu chuỗi');
        }

        if (passwordValue.length > 20) {
            throw new Error('Mật khẩu không được lớn hơn 20 ký tự');
        }

        if (passwordValue.length < 6) {
            throw new Error('Mật khẩu không được ít hơn 6 ký tự');
        }
    }),
    body('confirm').custom(async (passwordValue) => {
        if (typeof passwordValue !== 'string') {
            throw new Error('Mật khẩu phải là kiểu chuỗi');
        }
    }),
];

export const validateUserLogin = baseRequest(validationsUserLogin);
export const validateUserStore = baseRequest(validationsUserStore);
export const validateChangePassword = baseRequest(validationChangePassword);
