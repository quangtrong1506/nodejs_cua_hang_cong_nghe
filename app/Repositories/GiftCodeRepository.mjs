import GiftCode from '../Models/GiftCode.mjs';
import BaseRepository from './BaseRepository.mjs';

class GiftCodeRepository extends BaseRepository {
    constructor() {
        super(GiftCode);
    }
}

export default new GiftCodeRepository();
