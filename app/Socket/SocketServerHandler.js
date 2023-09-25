import AdminNamespace from './Namespaces/Admin/AdminNamespace.js';
import ChatNamespace from './Namespaces/Chat/ChatNamespace.js';
import NotificationNamespace from './Namespaces/Notifiaction/NotificationNamespace.js';

class SocketServerHandler {
    constructor() {
        this.chatNamespace = new ChatNamespace();
        this.adminNamespace = new AdminNamespace();
        this.notificationNamespace = new NotificationNamespace();
    }
    handle() {
        this.chatNamespace.handle();
        this.adminNamespace.handle();
        this.notificationNamespace.handle();
    }
}

export default SocketServerHandler;
