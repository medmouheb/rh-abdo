import mongoose, { Schema, Document } from 'mongoose';

export interface IHiringRequest extends Document {
    requestDate?: Date;
    personnelType: string;
    service: string;
    workLocation: string;
    businessUnit?: string;
    jobTitle: string;
    desiredHiringDate?: Date;
    reason: string;
    replacementName?: string;
    departureReason?: string;
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
    contractType: string;
    justification: string;
    jobCharacteristics: string;
    candidateEducation: string;
    candidateSkills: string;
    recruiterId?: mongoose.Types.ObjectId;
    recruitmentSource?: string;
    recruitmentMode: string;
    comments?: string;
    hiringCost?: number;
    processDuration?: number;
    performanceRatio?: number;
    actualHiringDate?: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const HiringRequestSchema = new Schema<IHiringRequest>(
    {
        requestDate: { type: Date },
        personnelType: {
            type: String,
            required: true,
            enum: ['OUVRIER', 'ETAM', 'CADRE'],
        },
        service: { type: String, required: true },
        workLocation: { type: String, required: true },
        businessUnit: { type: String },
        jobTitle: { type: String, required: true },
        desiredHiringDate: { type: Date },
        reason: {
            type: String,
            required: true,
            enum: ['REPLACEMENT', 'BUDGETED_INCREASE', 'NON_BUDGETED_INCREASE'],
        },
        replacementName: { type: String },
        departureReason: {
            type: String,
            enum: ['DEMISSION', 'MUTATION', 'LICENCIEMENT', 'RETRAITE', 'DECES', 'AUTRE'],
        },
        dateRangeStart: { type: Date },
        dateRangeEnd: { type: Date },
        contractType: {
            type: String,
            required: true,
            enum: ['CDI', 'CDD'],
        },
        justification: { type: String, required: true },
        jobCharacteristics: { type: String, required: true },
        candidateEducation: { type: String, required: true },
        candidateSkills: { type: String, required: true },
        recruiterId: { type: Schema.Types.ObjectId, ref: 'User' },
        recruitmentSource: { type: String },
        recruitmentMode: {
            type: String,
            default: 'EXTERNAL',
            enum: ['INTERNAL', 'EXTERNAL'],
        },
        comments: { type: String },
        hiringCost: { type: Number },
        processDuration: { type: Number },
        performanceRatio: { type: Number },
        actualHiringDate: { type: Date },
        status: {
            type: String,
            default: 'VACANT',
            enum: ['VACANT', 'HIRED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'SUSPENDED'],
        },
    },
    {
        timestamps: true,
    }
);

export const HiringRequest = mongoose.model<IHiringRequest>(
    'HiringRequest',
    HiringRequestSchema
);
