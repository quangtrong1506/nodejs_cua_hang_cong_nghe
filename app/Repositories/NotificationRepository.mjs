import Notification from '../Models/Notification.mjs';
import BaseRepository from './BaseRepository.mjs';

class NotificationRepository extends BaseRepository {
    constructor() {
        super(Notification);
    }
}

export default new NotificationRepository();
