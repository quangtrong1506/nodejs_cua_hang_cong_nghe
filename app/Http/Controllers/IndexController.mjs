import BaseController from './BaseController.mjs';
class IndexController extends BaseController {
    async index(req, res) {
        res.json({
            code: 200,
            message: 'Success',
        });
    }
}

export default new IndexController();
