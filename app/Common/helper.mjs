import crypto from 'crypto';
import moment from 'moment';
import { socketServerHandler } from '../../index.js';
import NotificationRepository from '../Repositories/NotificationRepository.mjs';
export const hashHmacString = (string, algorithm = 'sha1') => {
    return crypto
        .createHmac(algorithm, process.env.PRIVATE_KEY)
        .update(string)
        .digest('hex');
};

export const generateJWTToken = (
    userId,
    algorithm = 'sha1',
    exp = moment().add(1, 'months').unix()
) => {
    const header = JSON.stringify({
        alg: algorithm,
        type: 'JWT',
    });
    const payload = JSON.stringify({
        id: userId,
        iat: moment().unix(),
        exp: exp,
    });
    const base64Header = Buffer.from(header)
        .toString('base64')
        .replace('==', '')
        .replace('=', '');
    const base64Payload = Buffer.from(payload)
        .toString('base64')
        .replace('==', '')
        .replace('=', '');
    const signature = hashHmacString(base64Header + '.' + base64Payload);

    return base64Header + '.' + base64Payload + '.' + signature;
};

export const parserJWTToken = (bearerToken, withBearerPrefix = true) => {
    const responseToken = {
        success: false,
    };

    if (!bearerToken) {
        return { ...responseToken, errors: 'Token không được để trống!' };
    }

    try {
        let token = [];

        if (withBearerPrefix) {
            token = bearerToken.split(' ')[1].split('.');
        } else {
            token = bearerToken.split('.');
        }
        const base64Header = token[0];
        const base64Payload = token[1];
        const signature = token[2];
        const header = JSON.parse(
            Buffer.from(base64Header, 'base64').toString()
        );

        if (
            hashHmacString(base64Header + '.' + base64Payload, header.alg) !==
            signature
        ) {
            return { ...responseToken, errors: 'Token không đúng định dạng!' };
        }
        const payload = JSON.parse(
            Buffer.from(base64Payload, 'base64').toString()
        );

        if (moment().unix() > payload.exp) {
            return { ...responseToken, errors: 'Token đã hết hạn!' };
        }

        return { ...responseToken, success: true, payload };
    } catch (e) {
        return { ...responseToken, errors: e.message };
    }
};

export const responseSuccess = (
    res,
    data,
    statusCode = 200,
    message = 'Thành công'
) => {
    return res.status(statusCode).json({
        now: new Date(),
        status_code: statusCode,
        data: data,
        message: message,
    });
};

export const responseErrors = (res, statusCode = 500, message, errors) => {
    if (Array.isArray(message)) {
        const [key, value] = (message = Object.entries(message[0])[0]);
        message = key + ' ' + value;
        errors = message;
    }
    return res.status(statusCode).json({
        now: new Date(),
        status_code: statusCode,
        errors: errors,
        message: message,
    });
};

export const generateConfirmUrl = (userId) => {
    const token = generateJWTToken(
        userId,
        'sha1',
        moment().add(1, 'days').unix()
    );

    return process.env.FE_DOMAIN + 'confirm-account?token=' + token;
};
export const stringToSlug = (str = '') => {
    // remove accents
    var from =
            'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
        to =
            'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], 'gi'), to[i]);
    }
    str = str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

    return str;
};
export const mongooseSlugGenerator = async (Repository, str) => {
    const data = await Repository.findBy({ slug: stringToSlug(str) });
    if (data.length === 0) return stringToSlug(str);
    else return stringToSlug(str + '-' + getID());
};

export const getID = (length) => {
    let a = 'zxcvbnmasdfghjklqwertyuiop1234567890';
    length = isNaN(length) ? 8 : length;
    let id = '';
    while (length--) {
        id += a[Math.floor(Math.random() * a.length)];
    }
    return id;
};
export const getProductSortOption = (sort) => {
    const option = {};
    switch (sort) {
        case 1:
            option.title = 1;
            break;
        case 2:
            option.title = -1;
            break;
        case 3:
            option.price = 1;
            break;
        case 4:
            option.price = -1;
            break;

        default:
    }
    return option;
};
export const numberToVndString = (number) => {
    if (typeof number !== 'number') number = 0;
    return number.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};

export const getDefaultSort = (sort) => {
    const options = {};
    if (sort == 0 || sort == 1) options.created_at = -1;
    else if (sort == 2) options.created_at = 1;
    return options;
};
export const sendUserNotification = (userId, { title, content }) => {
    return new Promise(async (resolve, rejects) => {
        const notification = await NotificationRepository.store({
            user_id: userId,
            title,
            content,
        });
        socketServerHandler.notificationNamespace.sendNotification({
            userId: userId,
            notification,
        });
        resolve();
        rejects();
    });
};
