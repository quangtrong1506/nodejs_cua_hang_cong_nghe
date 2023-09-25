import { responseErrors, responseSuccess } from '../../Common/helper.mjs';
import ChatRepository from '../../Repositories/ChatRepository.mjs';
import MessageRepository from '../../Repositories/MessageRepository.mjs';
import UserRepository from '../../Repositories/UserRepository.mjs';
import BaseController from './BaseController.mjs';

class MessageController extends BaseController {
    async userToAdmin(req, res) {
        try {
            const { chat_id, text } = req.body;
            const userId = res.locals.authUser._id;
            const check = await ChatRepository.findOne({
                _id: chat_id,
                members: { $elemMatch: { $eq: userId } },
            });

            if (!check)
                return responseErrors(
                    res,
                    404,
                    'Bạn không ở trong đoạn chat này'
                );
            const message = await MessageRepository.store({
                sender_id: userId,
                read: false,
                chat_id: check._id,
                text,
            });

            responseSuccess(res, message);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async adminToUser(req, res) {
        try {
            const { chat_id, text, user_id } = req.body;
            const adminId = res.locals.authUser._id;
            const user = await UserRepository.findById(user_id);
            if (!user) return responseErrors(res, 404, 'Không tìm thấy user');
            const check = await ChatRepository.findOne({
                _id: chat_id,
                members: { $elemMatch: { $eq: user._id } },
            });
            console.log('Controller:', { chat_id, text, user_id });
            if (!check)
                return responseErrors(
                    res,
                    404,
                    'Chưa có đoạn chat cập nhật sau'
                );
            const message = await MessageRepository.store({
                sender_id: adminId,
                read: false,
                chat_id: check._id,
                text,
            });
            responseSuccess(res, message);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async readByAdmin(req, res) {
        try {
            const { chat_id } = req.body;
            const message = await MessageRepository.updateByChatId(chat_id, {
                read: true,
            });
            responseSuccess(res, message);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async getListMessage(req, res) {
        try {
            const { id } = req.params;
            const { page } = req.query;
            const list = await MessageRepository.paginate(
                {
                    chat_id: id,
                },
                { page }
            );
            responseSuccess(res, list);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async getListMessageByAdmin(req, res) {
        try {
            const { id } = req.params;
            const list = await MessageRepository.paginate({
                chat_id: id,
            });
            // const lastMessage = list.docs[0];
            // await MessageRepository.update(lastMessage._id, { read: true });
            responseSuccess(res, list);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
}

export default new MessageController();
