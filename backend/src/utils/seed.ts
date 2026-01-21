import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { HiringRequest } from '../models/HiringRequest';
import { Candidate } from '../models/Candidate';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_system';

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const services = ['Production', 'Maintenance', 'Qualité', 'Logistique', 'RH', 'Finance', 'IT', 'Développement'];
const contractTypes = ['CDI', 'CDD'];
const personnelTypes = ['OUVRIER', 'ETAM', 'CADRE'];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Users
        const usersToSeed = [
            { username: 'admin', password: 'admin123', role: 'HR_MANAGER' },
            { username: 'plant_manager', password: 'password123', role: 'PLANT_MANAGER' },
            { username: 'requester', password: 'password123', role: 'REQUESTER' },
            { username: 'recruiter', password: 'password123', role: 'RECRUITER' },
            { username: 'hr_manager', password: 'password123', role: 'HR_MANAGER' }
        ];

        let createdUsers: any[] = [];
        for (const userData of usersToSeed) {
            let user = await User.findOne({ username: userData.username });
            if (!user) {
                user = new User(userData);
                await user.save();
                console.log(`✅ Created user: ${userData.username}`);
            }
            createdUsers.push(user);
        }

        const recruiters = createdUsers.filter(u => ['RECRUITER', 'HR_MANAGER'].includes(u.role));
        const requesters = createdUsers.filter(u => ['REQUESTER', 'PLANT_MANAGER'].includes(u.role));

        // 2. Clear & Seed Hiring Requests
        await HiringRequest.deleteMany({});
        console.log('🗑️  Cleared HiringRequests');

        const hiringRequests: any[] = [];
        for (let i = 0; i < 15; i++) {
            const service = getRandomItem(services);
            const status = getRandomItem(['VACANT', 'IN_PROGRESS', 'HIRED', 'COMPLETED']);
            
            const req = await HiringRequest.create({
                requestDate: getRandomDate(new Date(2025, 0, 1), new Date()),
                personnelType: getRandomItem(personnelTypes),
                service: service,
                workLocation: 'Tunis',
                jobTitle: `${getRandomItem(['Ingénieur', 'Technicien', 'Opérateur', 'Manager', 'Assistant'])} ${service}`,
                reason: getRandomItem(['REPLACEMENT', 'BUDGETED_INCREASE']),
                contractType: getRandomItem(contractTypes),
                justification: 'Renforcement.',
                jobCharacteristics: 'Expérience.',
                candidateEducation: 'Bac +3',
                candidateSkills: 'Skills...',
                recruiterId: getRandomItem(requesters)._id,
                status: status,
                hiringCost: 30000,
                recruitmentMode: 'EXTERNAL'
            });
            hiringRequests.push(req);
        }
        console.log(`✅ Created ${hiringRequests.length} Hiring Requests`);

        // 3. Clear & Seed Candidates
        await Candidate.deleteMany({});
        console.log('🗑️  Cleared Candidates');

        const firstNames = ['Mohamed', 'Ahmed', 'Sarra', 'Amine', 'Yasmine', 'Walid', 'Mariem', 'Karim', 'Sonia', 'Hassen'];
        const lastNames = ['Ben Ali', 'Trabelsi', 'Gharbi', 'Jaziri', 'Mansouri', 'Dridi', 'Bouazizi', 'Ayari', 'Saidi', 'Tlili'];

        for (let i = 0; i < 30; i++) {
            const linkedRequest = Math.random() > 0.3 ? getRandomItem(hiringRequests) : null;
            const status = linkedRequest ? getRandomItem(['SHORTLISTED', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW', 'SELECTED', 'HIRED']) : 'RECEIVED';
            
            await Candidate.create({
                firstName: getRandomItem(firstNames),
                lastName: getRandomItem(lastNames),
                email: `candidate${i}@example.com`,
                phone: '20123456',
                positionAppliedFor: linkedRequest ? linkedRequest.jobTitle : 'Spontané',
                department: linkedRequest ? linkedRequest.service : getRandomItem(services),
                status: status,
                recruitmentMode: 'EXTERNAL',
                hiringRequestId: linkedRequest ? linkedRequest._id : undefined,
                yearsOfExperience: 3,
                createdAt: getRandomDate(new Date(2025, 0, 1), new Date())
            });
        }
        console.log('✅ Created 30 Candidates');

        console.log('🎉 Seed completed!');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
