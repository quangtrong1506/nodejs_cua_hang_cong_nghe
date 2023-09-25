import Chat from '../Models/Chat.mjs';
import BaseRepository from './BaseRepository.mjs';

class ChatRepository extends BaseRepository {
    constructor() {
        super(Chat);
    }
}

export default new ChatRepository();
