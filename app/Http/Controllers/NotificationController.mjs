import { responseErrors, responseSuccess } from '../../Common/helper.mjs';
import NotificationRepository from '../../Repositories/NotificationRepository.mjs';
import BaseController from './BaseController.mjs';

class NotificationController extends BaseController {
    async show(_req, res) {
        const user_id = res.locals.authUser._id;
        try {
            const notifications = await NotificationRepository.paginate({
                user_id,
            });
            return responseSuccess(res, notifications.docs);
        } catch (error) {
            return responseErrors(res, 500, error.message);
        }
    }
}

export default new NotificationController();
