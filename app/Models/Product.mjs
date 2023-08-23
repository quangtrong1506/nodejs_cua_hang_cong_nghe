import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Tiêu đề sản phẩm không được để trống'],
        },
        slug: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
            min: 0,
            default: 0,
        },
        discount_percentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        stock: {
            type: Number,
            require: true,
            min: 0,
            default: 0,
        },
        status: {
            type: ObjectId,
            require: true,
        },
        brand: {
            type: ObjectId,
            require: true,
        },
        category: {
            type: ObjectId,
            require: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            require: [true, 'Ảnh đại diện không thể bỏ trống'],
        },
        images: {
            type: [String],
            default: [],
            require: true,
        },
        rating: {
            type: ObjectId,
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
export default mongoose.model('products', productSchema);
