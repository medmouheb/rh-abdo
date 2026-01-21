import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
    candidateId: mongoose.Types.ObjectId;
    type: string;
    scheduledAt: Date;
    interviewerId?: mongoose.Types.ObjectId;
    juryMembers?: string;
    result?: string;
    comments?: string;
    recommendations?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['TECHNICAL', 'HR'],
        },
        scheduledAt: { type: Date, required: true },
        interviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
        juryMembers: { type: String },
        result: {
            type: String,
            enum: ['ADMITTED', 'PENDING', 'REJECTED'],
        },
        comments: { type: String },
        recommendations: { type: String },
    },
    {
        timestamps: true,
    }
);

export const Interview = mongoose.model<IInterview>('Interview', InterviewSchema);
