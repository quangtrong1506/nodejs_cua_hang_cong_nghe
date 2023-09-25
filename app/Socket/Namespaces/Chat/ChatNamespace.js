import { socketIOServer } from '../../../../index.js';
import UserRepository from '../../../Repositories/UserRepository.mjs';
import { handleUserMessage } from '../../helpers/helpers.js';
import AdminNamespace from '../Admin/AdminNamespace.js';
import BaseNamespace from '../BaseNamespace.js';
class UserChatNamespace extends BaseNamespace {
    constructor() {
        super('/chat');
        this.users = [];
    }
    handle() {
        socketIOServer.of(this.namespace).on('connection', (socket) => {
            socket.on('chat_with_admin', async ({ userId, message }) => {
                socket.broadcast.emit('get_user_chat', { userId, message });
                //
                handleUserMessage({ socketIOServer, socket, message, userId });
                const userInfo = await UserRepository.findById(userId);
                const adminNamespace = new AdminNamespace();
                adminNamespace.sendNotification({
                    type: 1,
                    title: `${userInfo?.name} đã gửi 1 tin nhắn`,
                    body: message.text,
                });
            });
            socket.on('chat_with_user', async ({ userId, message }) => {
                const users = this.users.filter(
                    (user) => user.userId == userId
                );
                users.forEach((user) => {
                    socket.to(user.socketId).emit('get_chat', { message });
                });
            });
            socket.on('user_online', async ({ userId }) => {
                this.users.push({ userId, socketId: socket.id });
            });
            socket.on('disconnect', () => {
                const index = this.users.findIndex(
                    (user) => user.socketId === socket.id
                );
                if (index !== -1) this.users.splice(index, 1);
            });
        });
    }
    emitChatAI({ userId, message }) {
        console.log(this.users, userId);
        const users = this.users.filter((user) => user.userId == userId);
        users.forEach((user) => {
            socketIOServer
                .of(this.namespace)
                .to(user.socketId)
                .emit('get_chat', { message });
        });
    }
}

export default UserChatNamespace;
