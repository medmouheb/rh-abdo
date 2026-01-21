import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    password: string;
    role: 'rh' | 'manager' | 'directeur' | 'REQUESTER' | 'RECRUITER' | 'PLANT_MANAGER' | 'HR_MANAGER' | 'co';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['rh', 'manager', 'directeur', 'REQUESTER', 'RECRUITER', 'PLANT_MANAGER', 'HR_MANAGER', 'co'],
            default: 'REQUESTER',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        const { password, ...rest } = ret;
        return rest;
    },
});

export const User = mongoose.model<IUser>('User', UserSchema);
