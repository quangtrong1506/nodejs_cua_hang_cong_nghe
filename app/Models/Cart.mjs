import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: ObjectId,
            required: true,
        },
        products: {
            type: Array,
            default: [],
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
cartSchema.plugin(mongoosePaginate);
export default mongoose.model('cart', cartSchema);
