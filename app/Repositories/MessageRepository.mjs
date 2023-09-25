import Message from '../Models/Message.mjs';
import BaseRepository from './BaseRepository.mjs';

class MessageRepository extends BaseRepository {
    constructor() {
        super(Message);
    }
    updateByChatId(chatId, data) {
        return this.getModel()
            .findOneAndUpdate({ chat_id: chatId }, data)
            .sort({ created_at: -1 });
    }
}

export default new MessageRepository();
