import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: string;
    title: string;
    message: string;
    relatedId?: number;
    relatedType?: string;
    isRead: boolean;
    readAt?: Date;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: { type: String, required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        relatedId: { type: Number },
        relatedType: { type: String },
        isRead: { type: Boolean, default: false },
        readAt: { type: Date },
        createdBy: { type: Number },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model<INotification>(
    'Notification',
    NotificationSchema
);
