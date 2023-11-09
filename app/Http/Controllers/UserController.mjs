import {
    responseErrors,
    responseSuccess,
    // sendUserNotification,
} from '../../Common/helper.mjs';
import UserRepository from '../../Repositories/UserRepository.mjs';
import BaseController from './BaseController.mjs';

class UserController extends BaseController {
    show(_req, res) {
        const user = res.locals.authUser;
        return responseSuccess(res, user);
    }
    async index(req, res) {
        try {
            const options = {
                page: req.query.page,
                limit: req.query.limit,
            };
            const data = await UserRepository.paginate({}, options);
            responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
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
            responseSuccess(res, user);
        } catch (e) {
            return responseErrors(res, 400, e.message);
        }
    }

    async count(_req, res) {
        try {
            const data = await UserRepository.count();
            responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
}
export default new UserController();
