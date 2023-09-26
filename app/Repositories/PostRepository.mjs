import Post from '../Models/Post.mjs';
import BaseRepository from './BaseRepository.mjs';

class PostRepository extends BaseRepository {
    constructor() {
        super(Post);
    }
}

export default new PostRepository();
