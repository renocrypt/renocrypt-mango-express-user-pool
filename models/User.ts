// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password: string;
    name?: string;
    role: 'admin' | 'owner' | 'manager' | 'user';
    refreshToken?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'owner', 'manager', 'user'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model<IUser>('User', UserSchema);
