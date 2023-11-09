import mongoose from 'mongoose';
import {
    responseErrors,
    responseSuccess,
    // sendUserNotification,
} from '../../Common/helper.mjs';
import GiftCodeRepository from '../../Repositories/GiftCodeRepository.mjs';
import OrderRepository from '../../Repositories/OrderCodeRepository.mjs';
import ProductRepository from '../../Repositories/ProductRepository.mjs';
import BaseController from './BaseController.mjs';
class OrderController extends BaseController {
    async index(req, res) {
        try {
            const options = {
                page: req.query.page,
                limit: req.query.limit,
            };
            const data = await OrderRepository.paginate({}, options);
            responseSuccess(res, data);
        } catch (error) {
            responseErrors(res, 500, error.message);
        }
    }
    async store(req, res) {
        try {
            const data = {
                user_id: res.locals.authUser._id,
                user_info: {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                },
                payment: {
                    payment_method: 0,
                    payment_status: false,
                    discount: 0,
                    total: 0,
                },
                transport: {
                    shipping_fee: 30000,
                    delivery_time: null,
                    tracking_code: '',
                    history: [],
                },
                ...req.body,
            };
            const gifts = await GiftCodeRepository.findBy({
                code: data.gift_code,
            });
            const gift = gifts?.[0];
            let discount = 0;
            const total = data.products.reduce((sum, prod) => {
                return (
                    sum +
                    (prod.price - (prod.price * prod.discount_percentage) / 100) * prod.quantity
                );
            }, 0);
            if (gift) {
                if (gift.status.user_used?.find((id) => id.toString() === data.user_id))
                    responseErrors(res, 500, [{ gift_code: 'Đã được sử dụng' }]);
                if (gift.status.type === 1 && gift.status.user_id !== user_id)
                    responseErrors(res, 500, [{ gift_code: 'Không hợp lệ' }]);

                if (gift.status.type === 0 && total >= gift.status.min_price)
                    discount = gift.discount.value;
                else if (gift.status.type === 1 && total >= gift.status.min_price) {
                    discount = gift.discount.percent * total;
                    if (discount > gift.status.max_discount) discount = gift.status.max_discount;
                }
            }
            data.payment.discount = discount;
            data.payment.total = total;
            const newOrder = await OrderRepository.store(data);
            // Trừ sản phẩm trừ và gift code nếu có
            console.log(data.products);
            for await (const product of data.products) {
                await ProductRepository.update(product.id, {
                    $inc: { stock: -product.quantity },
                });
            }
            console.log(gift);
            const user_used = gift.status.user_used || [];
            user_used.push(res.locals.authUser._id);
            await GiftCodeRepository.update(gift._id, {
                $set: {
                    'status.user_used': user_used,
                },
            });
            //
            await sendUserNotification(res.locals.authUser._id, {
                title: 'Đặt hàng thành công!',
                content: 'Mã đơn hàng của bạn: ' + newOrder._id,
            });
            responseSuccess(res, { id: newOrder._id });
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, 'Lỗi đặt hàng');
        }
    }
    async getListOrderByUser(req, res) {
        try {
            const user_id = res.locals.authUser._id;
            const listOrders = await OrderRepository.findBy({ user_id });
            responseSuccess(res, listOrders);
        } catch (error) {
            responseErrors(res, 500, 'Lỗi lấy danh sách');
        }
    }
    async show(req, res) {
        try {
            const id = req.params.id;
            if (!mongoose.isValidObjectId(id))
                return responseErrors(res, 404, 'Đơn hàng không tồn tại');
            const order = await OrderRepository.findById(id);
            if (!order) return responseErrors(res, 404, 'Đơn hàng không tồn tại');
            const data = { ...order._doc, id: order._id };
            delete data._id;
            responseSuccess(res, data);
        } catch (error) {
            responseErrors(res, 500, error.message);
        }
    }
    async cancelOrder(req, res) {
        try {
            const id = req.params.id;
            const data = JSON.parse(req.headers.data);
            if (!mongoose.isValidObjectId(id))
                return responseErrors(res, 404, 'Đơn hàng không tồn tại');
            const order = await OrderRepository.update(id, {
                status: {
                    status_code: 0,
                    message: data.message ?? 'Lý do khác',
                },
            });
            if (!order) return responseErrors(res, 404, 'Đơn hàng không tồn tại');
            await sendUserNotification(res.locals.authUser._id, {
                title: 'Huỷ đơn hàng thành công!',
                content: 'Mã đơn hàng của bạn: ' + order._id,
            });
            responseSuccess(res, order);
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
    async count(_req, res) {
        try {
            const data = await OrderRepository.count({});
            responseSuccess(res, data);
        } catch (error) {
            return responseErrors(res, 400, error.message);
        }
    }
}

export default new OrderController();
