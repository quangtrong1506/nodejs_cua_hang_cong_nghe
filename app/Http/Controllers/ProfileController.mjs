import {
    hashHmacString,
    responseErrors,
    responseSuccess,
    // sendUserNotification,
} from '../../Common/helper.mjs';
import UserRepository from '../../Repositories/UserRepository.mjs';
import BaseController from './BaseController.mjs';

class ProfileController extends BaseController {
    show(_req, res) {
        const user = res.locals.authUser;
        return responseSuccess(res, user);
    }

    async update(req, res) {
        try {
            const data = {
                name: req.body.name,
                avatar: req.body.avatar,
                address: req.body.address,
                phone: req.body.phone,
            };

            const user = await UserRepository.update(res.locals.authUser._id, data);
            responseSuccess(res, {
                ...user._doc,
                name: req.body.name,
                avatar: req.body.avatar ?? user.avatar,
                address: req.body.address,
                phone: req.body.phone,
            });
            await sendUserNotification(res.locals.authUser._id, {
                title: 'Cập nhật thông tin thành công!',
                content: '',
            });
        } catch (e) {
            return responseErrors(res, 400, e.message);
        }
    }

    async changePassword(req, res) {
        try {
            const userUpdated = await UserRepository.update(res.locals.authUser._id, {
                password: hashHmacString(req.body.password),
            });

            return responseSuccess(res, userUpdated);
        } catch (e) {
            return responseErrors(res, 500, e.message);
        }
    }
}

export default new ProfileController();
