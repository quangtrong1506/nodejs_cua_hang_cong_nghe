import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const postsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
        thumbnail: {
            type: String,
        },
        slug: {
            type: String,
            require: true,
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
postsSchema.plugin(mongoosePaginate);
export default mongoose.model('posts', postsSchema);
