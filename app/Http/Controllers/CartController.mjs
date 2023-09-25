import { responseErrors, responseSuccess } from '../../Common/helper.mjs';
import CartRepository from '../../Repositories/CartRepository.mjs';
import ProductRepository from '../../Repositories/ProductRepository.mjs';
import BaseController from './BaseController.mjs';
class CategoryController extends BaseController {
    async index(_req, res) {
        try {
            const carts = await CartRepository.findBy({
                user_id: res.locals.authUser._id,
            });
            const products = carts[0] ? carts[0].products : [];
            const result = [];
            let count = 0;
            for await (const product of products) {
                const res = await ProductRepository.findById(product.id);
                const prod = { ...res._doc };
                let price =
                    prod.price - (prod.price * prod.discount_percentage) / 100;
                price = price < 0 ? 0 : price;
                result.push({
                    id: prod._id,
                    price,
                    quantity: product.quantity,
                });
                count += product.quantity;
            }
            responseSuccess(res, {
                products: result,
                count: count,
            });
        } catch (error) {
            responseErrors(res, 500, error.message);
        }
    }
    async update(req, res) {
        try {
            const productId = req.body.productId;
            const quantity = parseInt(req.body.quantity);
            let product = null;
            let myCarts = null;
            await Promise.all([
                ProductRepository.findById(productId),
                CartRepository.findBy({
                    user_id: res.locals.authUser._id,
                }),
            ]).then((value) => {
                product = value[0];
                myCarts = value[1];
            });
            if (!product)
                return responseErrors(res, 404, 'Sản phẩm không tồn tại');
            if (product.status == 3)
                return responseErrors(res, 401, 'Sản phẩm đã ngừng kinh doanh');
            if (product.status === 2 || product.stock === 0)
                return responseErrors(res, 401, 'Sản phẩm đã hết hàng');
            if (myCarts.length !== 0) {
                let products = myCarts[0].products;
                let index = products.findIndex((prod) => prod.id === productId);
                let count = quantity;
                if (index >= 0) {
                    count += products[index].quantity;
                    products[index].quantity = count;
                } else products.push({ id: productId, quantity: count });
                if (count > product.stock)
                    return responseErrors(
                        res,
                        401,
                        'Thêm sản phẩm vượt quá số lượng cửa hàng có'
                    );
                if (count < 1)
                    return responseErrors(res, 401, 'Số lượng không hợp lệ');
                await CartRepository.update(myCarts[0]._id, {
                    products: products,
                });
            } else {
                if (quantity > product.stock)
                    return responseErrors(
                        res,
                        401,
                        'Thêm sản phẩm vượt quá số lượng cửa hàng có'
                    );
                await CartRepository.store({
                    user_id: res.locals.authUser._id,
                    products: [
                        {
                            id: productId,
                            quantity,
                        },
                    ],
                });
            }
            responseSuccess(res, { productId, quantity });
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, 'Lỗi thêm vào giỏ hàng');
        }
    }
    async set(req, res) {
        try {
            const productId = req.body.productId;
            const quantity = parseInt(req.body.quantity);
            let product = null;
            let myCarts = null;
            await Promise.all([
                ProductRepository.findById(productId),
                CartRepository.findBy({
                    user_id: res.locals.authUser._id,
                }),
            ]).then((value) => {
                product = value[0];
                myCarts = value[1];
            });
            if (!product)
                return responseErrors(res, 404, 'Sản phẩm không tồn tại');
            if (product.status == 3)
                return responseErrors(res, 401, 'Sản phẩm đã ngừng kinh doanh');
            if (product.status === 2 || product.stock === 0)
                return responseErrors(res, 401, 'Sản phẩm đã hết hàng');
            if (myCarts.length !== 0) {
                let products = myCarts[0].products;
                let index = products.findIndex((prod) => prod.id === productId);
                let count = quantity;
                if (index >= 0) {
                    products[index].quantity = quantity;
                } else products.push({ id: productId, quantity: count });
                if (count > product.stock)
                    return responseErrors(
                        res,
                        401,
                        'Thêm sản phẩm vượt quá số lượng cửa hàng có'
                    );
                if (count < 1)
                    return responseErrors(res, 401, 'Số lượng không hợp lệ');
                await CartRepository.update(myCarts[0]._id, {
                    products: products,
                });
            } else {
                if (quantity > product.stock)
                    return responseErrors(
                        res,
                        401,
                        'Thêm sản phẩm vượt quá số lượng cửa hàng có'
                    );
                await CartRepository.store({
                    user_id: res.locals.authUser._id,
                    products: [
                        {
                            id: productId,
                            quantity,
                        },
                    ],
                });
            }
            responseSuccess(res, { productId, quantity });
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, 'Lỗi thêm vào giỏ hàng');
        }
    }
    async removeProduct(req, res) {
        try {
            const productId = req.params?.id || '';
            const product = await ProductRepository.findById(productId);
            if (!product)
                return responseErrors(res, 404, 'Sản phẩm không tồn tại');
            const myCarts = await CartRepository.findBy({
                user_id: res.locals.authUser._id,
            });
            if (myCarts[0]) {
                let products = myCarts[0].products;
                const index = products.findIndex(
                    (prod) => prod.id === productId
                );
                if (index === -1)
                    return responseErrors(
                        res,
                        404,
                        'Không tìm thấy sản phẩm trong giỏ hàng'
                    );
                await CartRepository.update(myCarts[0]._id, {
                    $pull: {
                        products: { id: productId },
                    },
                });
                responseSuccess(res, { productId });
            } else responseErrors(res, 401, 'Giỏ hàng đang trống');
        } catch (error) {
            console.log(error);
            responseErrors(res, 500, error.message);
        }
    }
}

export default new CategoryController();
