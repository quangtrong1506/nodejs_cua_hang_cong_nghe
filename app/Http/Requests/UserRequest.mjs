import { baseRequest } from './BaseRequest.mjs';
import { body, query } from 'express-validator';
import { USERS } from '../../../config/common.mjs';
import paginateRequest from './PaginateRequest.js';

const validationsStoreOrUpdateUser = [
    body('name').custom(async (nameValue) => {
        if (typeof nameValue !== 'string') {
            throw new Error('Họ tên phải là kiểu chuỗi');
        }
        if (nameValue.length > 50) {
            throw new Error('Họ tên không được lớn hơn 50 ký tự');
        }
    }),
    body('phone').custom(async (phoneValue) => {
        if (typeof phoneValue !== 'string') {
            throw new Error('Số điện thoại phải là kiểu chuỗi');
        }

        if (phoneValue.length > 11) {
            throw new Error('Số điện thoại không được lớn hơn 11 ký tự');
        }

        if (phoneValue.length < 10) {
            throw new Error('Số điện thoại không được ít hơn 10 ký tự');
        }
    }),
    body('level')
        .isIn(Object.values(USERS.level))
        .withMessage('Giá trị đã chọn trong trường phân quyền không hợp lệ.'),
    body('email')
        .custom(async (emailValue) => {
            if (typeof emailValue !== 'string') {
                throw new Error('Email phải là kiểu chuỗi');
            }
            if (emailValue.length > 50) {
                throw new Error('Email không được lớn hơn 50 ký tự');
            }
        })
        .isEmail()
        .withMessage('Email không đúng định dạng'),
];

const validationsIndexUser = [
    query('name')
        .optional()
        .custom(async (nameValue) => {
            if (nameValue && nameValue.length > 50) {
                throw new Error('Họ tên không được lớn hơn 50 ký tự');
            }
        }),
    query('email')
        .optional({ values: 'falsy' })
        .custom(async (emailValue) => {
            if (emailValue && emailValue.length > 50) {
                throw new Error('Họ tên không được lớn hơn 50 ký tự');
            }
        })
        .isEmail({ require_tld: true })
        .withMessage('Email không đúng định dạng'),
    query('phone')
        .optional()
        .custom(async (value) => {
            if (value && (value?.length > 11 || value?.length < 10)) {
                throw new Error('Số điện thoại phải từ 10 - 11 ký tự');
            }
        }),
    query('level')
        .isIn([...Object.values(USERS.level), null])
        .withMessage('Giá trị đã chọn trong trường phân quyền không hợp lệ.'),
];

export const validateIndexUser = baseRequest([...validationsIndexUser, ...paginateRequest]);
export const validateStoreOrUpdateUser = baseRequest(validationsStoreOrUpdateUser);
