import BaseRepository from './BaseRepository.mjs';
import Admin from '../Models/Admin.mjs';

class AdminRepository extends BaseRepository {
    constructor() {
        super(Admin);
    }
}

export default new AdminRepository();
