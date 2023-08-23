import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const commentSchema = new mongoose.Schema(
    {
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
export default mongoose.model('comments', commentSchema);
