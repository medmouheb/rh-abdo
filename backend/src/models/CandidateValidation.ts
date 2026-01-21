import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidateValidation extends Document {
    candidateId: mongoose.Types.ObjectId;
    validatorId: mongoose.Types.ObjectId;
    stage: string;
    decision: string;
    comments?: string;
    selectionCriteria?: string;
    observations?: string;
    createdAt: Date;
}

const CandidateValidationSchema = new Schema<ICandidateValidation>(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
        },
        validatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        stage: {
            type: String,
            required: true,
            enum: ['PERSONNEL_REQUEST', 'SHORTLIST', 'FINAL_SELECTION'],
        },
        decision: {
            type: String,
            required: true,
            enum: ['APPROVED', 'REJECTED', 'PENDING'],
        },
        comments: { type: String },
        selectionCriteria: { type: String },
        observations: { type: String },
    },
    {
        timestamps: true,
    }
);

export const CandidateValidation = mongoose.model<ICandidateValidation>(
    'CandidateValidation',
    CandidateValidationSchema
);
