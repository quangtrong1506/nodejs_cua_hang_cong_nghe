import { responseErrors, responseSuccess } from '../../Common/helper.mjs';
import ChatRepository from '../../Repositories/ChatRepository.mjs';
import MessageRepository from '../../Repositories/MessageRepository.mjs';
import UserRepository from '../../Repositories/UserRepository.mjs';
import BaseController from './BaseController.mjs';

class ChatController extends BaseController {
    async create(req, res) {
        try {
            const { chat_with_admin } = req.body;
            const userId = res.locals.authUser._id;
            let chat = null;
            if (chat_with_admin) {
                chat = await ChatRepository.findOne({
                    chat_with_admin: true,
                    members: { $elemMatch: { $eq: userId } },
                });
                if (!chat)
                    chat = await ChatRepository.store({
                        chat_with_admin: true,
                        members: [userId],
                    });
            }
            responseSuccess(res, chat);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async getChatByUser(_req, res) {
        try {
            const userId = res.locals.authUser._id;
            let chat = null;
            chat = await ChatRepository.findOne({
                chat_with_admin: true,
                members: { $elemMatch: { $eq: userId } },
            });
            if (!chat)
                chat = await ChatRepository.store({
                    chat_with_admin: true,
                    members: [userId],
                });

            responseSuccess(res, chat);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async userChatWithAdmin(req, res) {
        try {
            const chats = await ChatRepository.paginate({
                chat_with_admin: true,
            });
            const promise = [];
            chats.docs.forEach((chat) => {
                promise.push(UserRepository.findById(chat.members[0]));
            });
            const users = await Promise.all(promise);
            const promise2 = [];
            chats.docs.forEach((chat) => {
                promise2.push(
                    MessageRepository.findOne(
                        {
                            chat_id: chat._id.toString(),
                        },
                        { created_at: -1 }
                    )
                );
            });
            const messages = await Promise.all(promise2);
            const result = [];
            for (let i = 0; i < users.length; i++) {
                result.push({
                    user: users[i],
                    message: messages[i] || {
                        text: null,
                        created_at: chats.docs[i].created_at,
                    },
                    chat: chats.docs[i],
                });
            }
            result.sort((a, b) => {
                return (
                    new Date(b['message'].created_at).getTime() -
                    new Date(a['message'].created_at).getTime()
                );
            });
            let data = [
                ...result.filter((value) => value.message?.read === false),
                ...result.filter((value) => value.message?.read === true),
                ...result.filter((value) => value.message?.text === null),
            ];
            responseSuccess(res, data);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
}

export default new ChatController();
