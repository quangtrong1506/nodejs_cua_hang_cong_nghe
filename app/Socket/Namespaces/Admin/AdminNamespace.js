// import { socketIOServer } from '../../../../index.js';
import BaseNamespace from '../BaseNamespace.js';

class AdminNamespace extends BaseNamespace {
    constructor() {
        super('/admin');
    }

    handle() {
        socketIOServer.of(this.namespace).on('connection', (socket) => {
            console.log(this.namespace, socket.id);
        });
    }
    sendNotification({ title, body, type }) {
        socketIOServer.of(this.namespace).emit('get-notification', {
            title: title || 'New notification!',
            body: body ?? 'Hello world!',
            type: type ?? 0,
        });
    }
}

export default AdminNamespace;
