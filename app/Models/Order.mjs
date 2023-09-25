import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: ObjectId,
            required: true,
        },
        user_info: {
            type: Object,
            default: {},
        },
        products: {
            type: Array,
            default: [],
        },
        status: {
            type: Object,
            default: {
                status_code: 1,
                message: '',
            },
        },
        payment: {
            type: Object,
            default: {
                payment_method: 0,
                payment_status: false,
                discount: 0,
                total: 0,
            },
        },
        note: {
            type: String,
            default: '',
        },
        address: {
            type: Object,
            default: {
                provinces: -1,
                districts: -1,
                wards: -1,
                details: '',
            },
        },
        transport: {
            type: Object,
            default: {
                shipping_fee: 0,
                delivery_time: null,
                tracking_code: '', // mã vận đơn,
                history: [],
            },
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
orderSchema.plugin(mongoosePaginate);
export default mongoose.model('orders', orderSchema);
