import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthDate?: Date;
    gender?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    positionAppliedFor: string;
    department?: string;
    specialty?: string;
    level?: string;
    yearsOfExperience?: number;
    language?: string;
    source?: string;
    recruitmentMode?: string;
    workSite?: string;
    educationLevel?: string;
    familySituation?: string;
    studySpecialty?: string;
    currentSalary?: number;
    salaryExpectation?: number;
    proposedSalary?: number;
    noticePeriod?: string;
    hrOpinion?: string;
    managerOpinion?: string;
    cvPath?: string;
    documentsPath?: string;
    recruiterComments?: string;
    status: string;
    hiringRequestId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        birthDate: { type: Date },
        gender: { type: String, enum: ['MALE', 'FEMALE'] },
        address: { type: String },
        postalCode: { type: String },
        city: { type: String },
        country: { type: String },
        positionAppliedFor: { type: String, required: true },
        department: { type: String },
        specialty: { type: String },
        level: { type: String },
        yearsOfExperience: { type: Number },
        language: { type: String },
        source: { type: String },
        recruitmentMode: { type: String, enum: ['INTERNAL', 'EXTERNAL'] },
        workSite: { type: String },
        educationLevel: { type: String },
        familySituation: { type: String },
        studySpecialty: { type: String },
        currentSalary: { type: Number },
        salaryExpectation: { type: Number },
        proposedSalary: { type: Number },
        noticePeriod: { type: String },
        hrOpinion: { type: String },
        managerOpinion: { type: String },
        cvPath: { type: String },
        documentsPath: { type: String },
        recruiterComments: { type: String },
        status: {
            type: String,
            default: 'RECEIVED',
            enum: [
                'RECEIVED',
                'SHORTLISTED',
                'TECHNICAL_INTERVIEW',
                'HR_INTERVIEW',
                'SELECTED',
                'MEDICAL_VISIT',
                'OFFER_SENT',
                'HIRED',
                'REJECTED',
            ],
        },
        hiringRequestId: { type: Schema.Types.ObjectId, ref: 'HiringRequest' },
    },
    {
        timestamps: true,
    }
);

export const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);
