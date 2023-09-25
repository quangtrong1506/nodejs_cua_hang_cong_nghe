import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const messageSchema = new mongoose.Schema(
    {
        chat_id: {
            type: ObjectId,
            require: true,
        },
        sender_id: {
            type: ObjectId,
            require: true,
        },
        text: {
            type: String,
            require: true,
        },
        read: {
            type: Boolean,
            default: false,
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
messageSchema.plugin(mongoosePaginate);
export default mongoose.model('messages', messageSchema);
