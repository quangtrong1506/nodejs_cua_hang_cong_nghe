import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên hãng không được để trống'],
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
brandSchema.plugin(mongoosePaginate);
export default mongoose.model('brand', brandSchema);
