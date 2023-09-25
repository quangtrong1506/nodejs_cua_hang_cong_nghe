import mongoose from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Họ tên không được để trống'],
            maxLength: [50, 'Họ tên không được lớn hơn {MAXLENGTH} ký tự'],
        },
        email: {
            type: String,
            required: [true, 'Email không được để trống'],
            unique: [true, 'Email đã tồn tại'],
            maxLength: [50, 'Email không được lớn hơn {MAXLENGTH} ký tự'],
        },
        phone: {
            type: String,
            required: [true, 'Số điện thoại không được để trống'],
            unique: [true, 'Số điện thoại đã tồn tại'],
            maxLength: [
                11,
                'Số điện thoại không được lớn hơn {MAXLENGTH} ký tự',
            ],
            minLength: [
                10,
                'Số điện thoại không được ít hơn {MINLENGTH} ký tự',
            ],
        },
        role: {
            type: Number,
            default: 0,
        },
        office: {
            type: String,
        },
        avatar: {
            type: String,
            default: '/images/default_avatar.png',
        },
        password: {
            type: String,
            required: [true, 'Mật khẩu không được để trống'],
            maxLength: [255, 'Mật khẩu không được lớn hơn {MAXLENGTH} ký tự'],
            minLength: [6, 'Mật khẩu không được ít hơn {MINLENGTH} ký tự'],
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
adminSchema.plugin(mongoosePaginate);
export default mongoose.model('admins', adminSchema);
