// import { socketIOServer } from '../../../../index.js';
import BaseNamespace from '../BaseNamespace.js';
class NotificationNamespace extends BaseNamespace {
    constructor() {
        super('/notification');
        this.users = [];
    }
    handle() {
        socketIOServer.of(this.namespace).on('connection', (socket) => {
            socket.on('user_online', async ({ userId }) => {
                this.users.push({ userId, socketId: socket.id });
            });
            socket.on('disconnect', () => {
                const index = this.users.findIndex((user) => user.socketId === socket.id);
                if (index !== -1) this.users.splice(index, 1);
            });
        });
    }
    sendNotification({ userId, notification }) {
        const users = this.users.filter((user) => user.userId == userId);
        users.forEach((user) => {
            socketIOServer
                .of(this.namespace)
                .to(user.socketId)
                .emit('get_new_notification', {
                    title: notification.title || 'Thông báo mới',
                    content: notification.content || '',
                    created_at: notification.created_at || new Date().toISOString(),
                });
        });
    }
}

export default NotificationNamespace;
