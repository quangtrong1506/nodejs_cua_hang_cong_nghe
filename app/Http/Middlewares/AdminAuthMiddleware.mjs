import { parserJWTToken, responseErrors } from '../../Common/helper.mjs';
import AdminRepository from '../../Repositories/AdminRepository.mjs';

export const adminAuthMiddleware = async (req, res, next) => {
    const responseToken = parserJWTToken(req.headers.authorization);
    if (!responseToken.success) {
        return responseErrors(res, 401, responseToken.errors ?? '');
    }
    try {
        const userId = responseToken.payload.id;
        const user = await AdminRepository.findById(userId);
        if (!user) {
            return responseErrors(res, 401, 'User không tồn tại.');
        }
        res.locals.authUser = user;
        next();
    } catch (e) {
        return responseErrors(res, 500, e.message);
    }
};
