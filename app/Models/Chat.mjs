import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const chatSchema = new mongoose.Schema(
    {
        chat_with_admin: {
            type: Boolean,
            default: true,
        },
        members: {
            type: Array,
            require: true,
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
chatSchema.plugin(mongoosePaginate);
export default mongoose.model('chats', chatSchema);
