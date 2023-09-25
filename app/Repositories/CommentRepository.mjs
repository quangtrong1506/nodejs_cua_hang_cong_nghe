import BaseRepository from './BaseRepository.mjs';
import Comment from '../Models/Comment.mjs';

class CommentRepository extends BaseRepository {
    constructor() {
        super(Comment);
    }
}

export default new CommentRepository();
// Hãng
