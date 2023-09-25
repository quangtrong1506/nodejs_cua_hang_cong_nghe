import { USERS } from '../../../config/common.mjs';
import {
    generateJWTToken,
    hashHmacString,
    parserJWTToken,
    responseErrors,
    responseSuccess,
    sendUserNotification,
} from '../../Common/helper.mjs';
import NotificationRepository from '../../Repositories/NotificationRepository.mjs';
import UserRepository from '../../Repositories/UserRepository.mjs';
import BaseController from './BaseController.mjs';
class AuthController extends BaseController {
    async login(req, res) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await UserRepository.findBy({ email });
            if (user.length === 0) {
                return responseErrors(res, 401, 'Email chưa được đăng ký!', [
                    { email: 'Email chưa được đăng ký' },
                ]);
            }
            if (user[0].password !== hashHmacString(password)) {
                return responseErrors(res, 401, 'Mật khẩu không chính xác', [
                    { password: 'Mật khẩu không chính xác' },
                ]);
            }
            return responseSuccess(res, {
                user_token: generateJWTToken(user[0].id),
            });
        } catch (e) {
            return responseErrors(res, 500, e.message, []);
        }
    }

    async store(req, res) {
        try {
            const params = req.body;
            const password = hashHmacString(params.password);
            const confirm = hashHmacString(params.confirm);
            if (confirm != password)
                return responseErrors(
                    res,
                    401,
                    'Xác nhận mật khẩu không chính xác',
                    [{ confirm: 'Xác nhận mật khẩu không chính xác' }]
                );
            const index = await UserRepository.count();
            const old = await UserRepository.findBy({ email: params.email });
            if (old.length > 0)
                return responseErrors(res, 401, 'Email đã tồn tại', [
                    {
                        email: 'Email đã tồn tại',
                    },
                ]);
            const user = await UserRepository.store({
                email: params.email,
                name: 'User_' + (index + 1),
                password,
            });
            // tạo thông báo
            await NotificationRepository.store({
                user_id: user._id,
                title: 'Tạo tài khoản thành công',
                content:
                    'Tài khoản đã được tạo vui lòng vào: thông tin cá nhân để cập nhật thông tin',
            });
            return responseSuccess(res, {
                user: user,
                user_token: generateJWTToken(user._id),
            });
        } catch (e) {
            console.log(e);
            return responseErrors(res, 500, e.message);
        }
    }

    async confirmAccount(req, res) {
        try {
            const responseToken = parserJWTToken(req.body.token, false);
            const userId = responseToken.payload.id;
            const user = await UserRepository.findById(userId);

            if (!user) {
                return responseErrors(res, 401, 'User không tồn tại.');
            }

            if (user.is_confirm_account === USERS.is_confirm_account.true) {
                return responseErrors(res, 401, 'User đã xác thực tài khoản.');
            }

            const userUpdated = await UserRepository.update(userId, {
                is_confirm_account: USERS.is_confirm_account.true,
            });

            return responseSuccess(res, {});
        } catch (e) {
            return responseErrors(res, 500, e.message);
        }
    }

    async changePassword(req, res) {
        try {
            const user = res.locals.authUser;
            if (hashHmacString(req.body.password) != user.password)
                return responseErrors(res, 401, 'Mật khẩu không chính xác', [
                    { password: 'Mật khẩu không chính xác' },
                ]);
            if (req.body.newPassword != req.body.confirm)
                return responseErrors(
                    res,
                    401,
                    'Xác nhận mật khẩu không chính xác',
                    [{ confirm: 'Xác nhận mật khẩu không chính xác' }]
                );
            const userUpdated = await UserRepository.update(user._id, {
                password: hashHmacString(req.body.newPassword),
            });
            await sendUserNotification(res.locals.authUser._id, {
                title: 'Thay đổi mật khẩu thành công!',
            });
            res.locals.authUser = userUpdated;
            return responseSuccess(res, userUpdated);
        } catch (e) {
            console.log(e);
            return responseErrors(res, 500, e.message);
        }
    }
}

export default new AuthController();
