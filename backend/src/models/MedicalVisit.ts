import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalVisit extends Document {
    candidateId: mongoose.Types.ObjectId;
    visitDate: Date;
    result: string;
    observations?: string;
    createdAt: Date;
}

const MedicalVisitSchema = new Schema<IMedicalVisit>(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
            unique: true,
        },
        visitDate: { type: Date, required: true },
        result: {
            type: String,
            required: true,
            enum: ['FIT', 'UNFIT'],
        },
        observations: { type: String },
    },
    {
        timestamps: true,
    }
);

export const MedicalVisit = mongoose.model<IMedicalVisit>(
    'MedicalVisit',
    MedicalVisitSchema
);
