import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const notificationSchema = new mongoose.Schema(
    {
        user_id: {
            type: ObjectId,
            required: true,
        },
        title: {
            type: String,
        },
        content: {
            type: String,
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
notificationSchema.plugin(mongoosePaginate);
export default mongoose.model('notifications', notificationSchema);
