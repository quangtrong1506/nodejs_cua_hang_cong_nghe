import BaseRepository from './BaseRepository.mjs';
import User from '../Models/User.mjs';
import { USERS } from '../../config/common.mjs';

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findUserConfirmedAccountByPhone(phone) {
        return await this.getModel().findOne({
            phone,
            is_confirm_account: USERS.is_confirm_account.true,
            deleted_at: null,
        });
    }
}

export default new UserRepository();
