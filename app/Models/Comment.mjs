import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const commentSchema = new mongoose.Schema(
    {
        post_id: {
            type: ObjectId,
        },
        product_id: {
            type: ObjectId,
        },
        user_id: {
            type: ObjectId,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            default: 5,
        },
        created_at: {
            type: Date,
            required: false,
        },
        updated_at: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);
commentSchema.plugin(mongoosePaginate);
export default mongoose.model('comments', commentSchema);
