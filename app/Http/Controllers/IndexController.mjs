import { responseErrors, responseSuccess } from '../../Common/helper.mjs';
import BaseController from './BaseController.mjs';
class IndexController extends BaseController {
    async index(_req, res) {
        const icon = ['(≧▽≦)', '(≧∇≦)ﾉ', '(/≧▽≦)/'];
        responseSuccess(res, {
            icon: icon[Math.floor(Math.random() * icon.length)],
        });
    }
    async error(req, res) {
        responseErrors(res, 404, {
            message: `No route matches URL '${req.path}'`,
            method: req.method,
            hostname: req.hostname,
            path: req.path,
            originalUrl: req.originalUrl,
            ip: req.ip,
        });
    }
}

export default new IndexController();
