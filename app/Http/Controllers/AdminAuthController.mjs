import BaseController from './BaseController.mjs';
import AdminRepository from '../../Repositories/AdminRepository.mjs';
import {
    generateJWTToken,
    hashHmacString,
    parserJWTToken,
    responseErrors,
    responseSuccess,
} from '../../Common/helper.mjs';
import { USERS, Admin } from '../../../config/common.mjs';
class AdminAuthController extends BaseController {
    async login(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await AdminRepository.findBy({ email });
            if (user.length === 0) {
                return responseErrors(res, 401, 'Email không hợp lệ');
            }
            if (user[0].password !== hashHmacString(password)) {
                return responseErrors(res, 401, 'Mật khẩu không chính xác');
            }
            return responseSuccess(res, {
                token: generateJWTToken(user[0].id),
            });
        } catch (e) {
            return responseErrors(res, 500, e.message);
        }
    }

    async changePassword(req, res) {
        try {
            const responseToken = parserJWTToken(req.body.token, false);
            const userId = responseToken.payload.id;
            const user = await UserRepository.findById(userId);

            if (!user) {
                return responseErrors(res, 401, 'User không tồn tại.');
            }

            if (user.is_confirm_account !== USERS.is_confirm_account.true) {
                return responseErrors(
                    res,
                    401,
                    'User chưa xác thực tài khoản.'
                );
            }

            const userUpdated = await UserRepository.update(userId, {
                password: hashHmacString(req.body.password),
            });

            return responseSuccess(res, userUpdated);
        } catch (e) {
            return responseErrors(res, 500, e.message);
        }
    }
}

export default new AdminAuthController();
