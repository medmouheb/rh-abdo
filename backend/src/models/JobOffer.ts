import mongoose, { Schema, Document } from 'mongoose';

export interface IJobOffer extends Document {
    candidateId: mongoose.Types.ObjectId;
    sentDate: Date;
    response?: string;
    responseDate?: Date;
    actualHiringDate?: Date;
    hrSignature?: string;
    signatureDate?: Date;
    createdAt: Date;
}

const JobOfferSchema = new Schema<IJobOffer>(
    {
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true,
            unique: true,
        },
        sentDate: { type: Date, required: true },
        response: {
            type: String,
            enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
        },
        responseDate: { type: Date },
        actualHiringDate: { type: Date },
        hrSignature: { type: String },
        signatureDate: { type: Date },
    },
    {
        timestamps: true,
    }
);

export const JobOffer = mongoose.model<IJobOffer>('JobOffer', JobOfferSchema);
