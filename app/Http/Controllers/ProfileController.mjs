import BaseController from './BaseController.mjs';
import {
    hashHmacString,
    parserJWTToken,
    responseErrors,
    responseSuccess,
} from '../../Common/helper.mjs';
import UserRepository from '../../Repositories/UserRepository.mjs';
import * as fs from 'fs';
import { STORAGE_PATHS, USERS } from '../../../config/common.mjs';
import winston from 'winston';

class ProfileController extends BaseController {
    show(req, res) {
        const user = res.locals.authUser;

        if (user.avatar) {
            try {
                user.avatar = JSON.stringify({
                    mimeType: user.avatar.split('.').pop(),
                    value: fs.readFileSync(user.avatar),
                });
            } catch (e) {
                winston.loggers.get('system').error('ERROR', e);
            }
        }

        return responseSuccess(res, user);
    }

    update(req, res) {
        try {
            const data = {
                name: req.body.name,
            };

            if (req.file) {
                data.avatar =
                    STORAGE_PATHS.uploadAvatarUser + req.file.filename;
            }
            UserRepository.update(res.locals.authUser._id, data).then(
                (response) => {
                    return responseSuccess(res, true);
                }
            );
        } catch (e) {
            return responseErrors(res, 400, e.message);
        }
    }

    async changePassword(req, res) {
        try {
            const userUpdated = await UserRepository.update(
                res.locals.authUser._id,
                {
                    password: hashHmacString(req.body.password),
                }
            );

            return responseSuccess(res, userUpdated);
        } catch (e) {
            return responseErrors(res, 500, e.message);
        }
    }
}

export default new ProfileController();
