import {
    hashHmacString,
    responseErrors,
    responseSuccess,
} from '../../Common/helper.mjs';
import AdminRepository from '../../Repositories/AdminRepository.mjs';
import BaseController from './BaseController.mjs';
class AdminController extends BaseController {
    async index(_req, res) {
        try {
            const admins = await AdminRepository.findBy({});
            return responseSuccess(res, admins);
        } catch (e) {
            return responseErrors(res, 500, e);
        }
    }
    async store(req, res) {
        try {
            const params = req.body;
            const password = hashHmacString(params.password);
            const admin = await AdminRepository.store({
                ...params,
                password,
            });
            return responseSuccess(res, admin);
        } catch (e) {
            return responseErrors(res, 500, e);
        }
    }

    async myInfo(_req, res) {
        try {
            return responseSuccess(res, res.locals.authUser);
        } catch (e) {
            return responseErrors(res, 500, e);
        }
    }
    async show(req, res) {
        try {
            const admin = await AdminRepository.findById(req.params.id);
            return responseSuccess(res, admin);
        } catch (e) {
            return responseErrors(res, 500, e);
        }
    }

    async update(req, res) {
        try {
            const adminUpdated = await AdminController.adminService.update(
                req.params.userId,
                req.body,
                res.locals.authUser
            );
            return responseSuccess(res, adminUpdated);
        } catch (e) {
            return responseErrors(res, 500, e);
        }
    }

    async destroy(req, res) {
        try {
            const adminDestroyed = await AdminController.adminService.destroy(
                req.params.userId
            );
            return responseSuccess(res, adminDestroyed);
        } catch (e) {
            return responseErrors(res, 500, e);
        }
    }
}

export default new AdminController();
