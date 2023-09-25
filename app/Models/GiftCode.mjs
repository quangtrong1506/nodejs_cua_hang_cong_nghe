import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const giftCodeSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discount: {
            type: Object,
            default: {
                percent: 0, //? phần trăm giảm
                value: 0, //? số tiền được giảm
            },
        },
        type: {
            type: Number, //?0 giảm theo tiền, giảm theo phần trăm
            default: 0,
        },
        status: {
            type: Object,
            default: {
                type: 0, //? 0 code chung, 1 code rành riêng
                min_price: 0, //? số tiền tối thiểu để áp được mã giảm giá
                max_discount: 0, //? mã giảm giá theo phần trăm giảm tối đa bao nhiêu
                user_id: null, //? ID người dùng nếu là code riêng
                user_used: [], // danh sách người đã sử dụng
                time: {}, // thời gian code có hiệu lực
            },
        },
        description: {
            type: String,
        },

        created_at: {
            type: Date,
            required: false,
            timestamps: true,
        },
        updated_at: {
            type: Date,
            required: false,
            timestamps: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);
giftCodeSchema.plugin(mongoosePaginate);
export default mongoose.model('gift_code', giftCodeSchema);
