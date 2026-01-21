import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidateStatusHistory extends Document {
    candidateId: mongoose.Types.ObjectId;
    oldStatus?: string;
    newStatus: string;
    statusLabel: string;
    changedBy?: mongoose.Types.ObjectId;
    comments?: string;
    reason?: string;
    createdAt: Date;
}

const CandidateStatusHistorySchema = new Schema<ICandidateStatusHistory>(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        oldStatus: { type: String },
        newStatus: { type: String, required: true },
        statusLabel: { type: String, required: true },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        comments: { type: String },
        reason: { type: String },
    },
    {
        timestamps: true,
    }
);

export const CandidateStatusHistory = mongoose.model<ICandidateStatusHistory>(
    'CandidateStatusHistory',
    CandidateStatusHistorySchema
);
