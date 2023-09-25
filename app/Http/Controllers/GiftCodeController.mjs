import {
    numberToVndString,
    responseErrors,
    responseSuccess,
} from '../../Common/helper.mjs';
import GiftCodeRepository from '../../Repositories/GiftCodeRepository.mjs';
import BaseController from './BaseController.mjs';

class GiftCodeController extends BaseController {
    async show(_req, res) {
        try {
            const gifts = await GiftCodeRepository.findBy({});
            return responseSuccess(res, gifts);
        } catch (error) {
            return responseErrors(res, 500, error.message);
        }
    }
    async add(req, res) {
        try {
            const data = {
                code: req.body.code.toLocaleUpperCase(),
                type: req.body.type, //? 0 Giảm theo giá tiền 1 giảm theo phần trăm
                status: req.body.status,
                discount: req.body.discount, //
                description: req.body.description,
            };
            data.description =
                data.description ?? data.type === 0
                    ? 'Mã giảm giá ' +
                      numberToVndString(parseInt(data.discount.value)) +
                      ' cho đơn hàng có giá trị từ ' +
                      numberToVndString(parseInt(data.status.min_price))
                    : 'Mã giảm giá ' +
                      data.discount.percent +
                      '% cho đơn hàng có giá trị từ ' +
                      numberToVndString(parseInt(data.status.min_price)) +
                      ', Giảm tối đa ' +
                      numberToVndString(parseInt(data.status.max_discount));
            if (data.status.type === 1) {
                if (!data.status.user_id)
                    return responseErrors(
                        res,
                        401,
                        'ID khách hàng không được để trống'
                    );
            }
            const giftCode = await GiftCodeRepository.store(data);
            return responseSuccess(res, giftCode);
        } catch (error) {
            console.log(error);
            return responseErrors(res, 500, error.message);
        }
    }
    async get(req, res) {
        try {
            const code = req.params.code;
            const giftCode = await GiftCodeRepository.findBy({ code });
            if (giftCode?.[0]) {
                const myGift = { ...giftCode[0]._doc };
                if (new Date(myGift.status.time.start) > new Date()) {
                    return responseErrors(
                        res,
                        401,
                        'Mã giảm giá không hợp lệ',
                        [{ code }]
                    );
                }
                if (new Date(myGift.status.time.end) < new Date())
                    return responseErrors(
                        res,
                        401,
                        'Mã giảm giá đã hết hạn sử dụng',
                        [{ code }]
                    );
                const gift = {
                    code: myGift.code,
                    value: null,
                    percent: null,
                    description: myGift.description,
                    type: myGift.type,
                    min: myGift.status.min_price,
                    max: null,
                };
                if (myGift.type === 1) {
                    gift.percent = myGift.discount.percent;
                    gift.max = myGift.status.max_discount;
                } else if (myGift.type == 0) {
                    gift.code = myGift.code;
                    gift.value = myGift.discount.value;
                }
                const flag = myGift.status.user_used?.some((element) => {
                    console.log(element, res.locals.authUser._id);
                    return (
                        element.toString() ===
                        res.locals.authUser._id.toString()
                    );
                });
                console.log(flag);
                if (flag)
                    return responseErrors(
                        res,
                        401,
                        'Bạn đã sử dụng mã này rồi',
                        [{ giftCode: 'Bạn đã sử dụng mã này rồi' }, { code }]
                    );
                return responseSuccess(res, gift);
            } else
                return responseErrors(res, 404, 'Gift code không tồn tại', [
                    { giftCode: 'Gift code không tồn tại' },
                    { code },
                ]);
        } catch (error) {
            console.log(error);
            return responseErrors(res, 500, error.message);
        }
    }
}

export default new GiftCodeController();
