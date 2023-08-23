import mongoose from 'mongoose';
const ratingSchema = new mongoose.Schema(
    {
        comments: {
            type: Array,
            default: [],
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
export default mongoose.model('rating', ratingSchema);
