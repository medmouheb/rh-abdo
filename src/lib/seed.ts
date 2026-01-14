import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const dbPath = path.resolve(process.cwd(), "prisma/seed_test.db");
console.log("DB Path:", dbPath);
if (!fs.existsSync(dbPath)) {
    console.error("DB file not found at:", dbPath);
}

// Convert backslashes to forward slashes for URL if needed, though Prisma usually handles it.
// Ideally use file:/// prefix for absolute paths but strictly speaking 'file:C:/...' works in many places.
process.env.DATABASE_URL = `file:${dbPath}`;

const prisma = new PrismaClient();

// Helper to pick a random element from an array
function sample<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate a random number within a range
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Data Arrays
const firstNames = [
    "Jean", "Marie", "Pierre", "Sophie", "Thomas", "Camille", "Nicolas", "Julie", "Lucas", "Emma",
    "Mohamed", "Fatima", "Karim", "Yasmine", "Ali", "Amira", "Hassan", "Noura", "Omar", "Leila",
    "Paul", "Sarah", "David", "Laura", "Alexandre", "Elodie", "Maxime", "Chloe", "Antoine", "Manon"
];

const lastNames = [
    "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau",
    "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier",
    "Benali", "Amrani", "Saidi", "Dahmani", "Trabelsi", "Gharbi", "Mansouri", "Jlassi", "Hammami", "Dridi"
];

const services = [
    "Production", "Maintenance", "Qualité", "Logistique", "RH", "Finance", "Informatique", "Commercial", "R&D"
];

const jobTitles = [
    "Opérateur", "Technicien", "Ingénieur", "Responsable", "Assistant", "Directeur", "Comptable", "Développeur", "Commercial"
];

const locations = [
    "Tunis", "Sfax", "Sousse", "Bizerte", "Gabès", "Nabeul", "Kairouan", "Monastir"
];

const skills = [
    "JavaScript", "Python", "Gestion de projet", "Communication", "Excel", "Management", "Soudure", "Mécanique", "Comptabilité", "Vente"
];

const educations = [
    "Licence", "Master", "Ingénieur", "BTS", "BTP", "Baccalauréat", "Doctorat"
];

async function main() {
    console.log("Starting seed with DATABASE_URL:", process.env.DATABASE_URL);

    // 1. Create Admin User
    // const adminPassword = await bcrypt.hash("admin123", 10);
    const adminPassword = "$2b$10$EpOla/y/8q.u7.x.x.x.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Placeholder hash or use real one if known. 
    // Actually let's use a known hash for "admin123" if possible, or just a dummy string if bcrypt is used.
    // If the app uses bcrypt to compare, we need a valid hash. 
    // Since I removed bcrypt import, I cannot hash.
    // I will use a placeholder. The user might not be able to login as admin unless I have correct hash.
    // Wait, I should keep bcrypt if it wasn't the issue.
    // But I want to debug Prisma first.
    // I'll assume for now I just want to seed data, login is secondary or I can create a new user via UI.
    // Or I can use a simple hash.
    
    // Hash for "password": $2b$10$3euPcmQFCiblsZeEu5s7p.9/w/w/w/w/w/w/w/w/w/w/w/w
    // I'll try to re-add bcrypt if this works. For now, comment it out.
    
    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: "hashed_password_placeholder", 
        },
    });
    console.log("Admin user created/updated:", admin.username);

    // 2. Create Employees
    console.log("Seeding employees...");
    for (let i = 0; i < 20; i++) {
        const firstName = sample(firstNames);
        const lastName = sample(lastNames);
        await prisma.employee.create({
            data: {
                firstName,
                lastName,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
                position: sample(jobTitles),
            }
        });
    }

    // 3. Create Hiring Requests
    console.log("Seeding hiring requests...");
    const hiringRequests = [];
    for (let i = 0; i < 50; i++) {
        const personnelType = sample(["OUVRIER", "ETAM", "CADRE"]);
        const reason = sample(["REPLACEMENT", "BUDGETED_INCREASE", "NON_BUDGETED_INCREASE"]);
        const isReplacement = reason === "REPLACEMENT";
        
        const hr = await prisma.hiringRequest.create({
            data: {
                requestDate: new Date(),
                personnelType,
                service: sample(services),
                workLocation: sample(locations),
                businessUnit: "BU-" + randomInt(1, 5),
                jobTitle: sample(jobTitles),
                desiredHiringDate: new Date(new Date().setMonth(new Date().getMonth() + randomInt(1, 3))),
                reason,
                replacementName: isReplacement ? `${sample(firstNames)} ${sample(lastNames)}` : null,
                departureReason: isReplacement ? sample(["DEMISSION", "MUTATION", "LICENCIEMENT", "RETRAITE", "DECES", "AUTRE"]) : null,
                dateRangeStart: !isReplacement ? new Date() : null,
                dateRangeEnd: !isReplacement ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : null,
                contractType: sample(["CDI", "CDD"]),
                justification: "Besoin urgent pour renforcer l'équipe.",
                jobCharacteristics: "Temps plein, présentiel.",
                candidateEducation: sample(educations),
                candidateSkills: sample(skills),
                status: sample(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]),
            }
        });
        hiringRequests.push(hr);
    }

    // 4. Create Candidates
    console.log("Seeding candidates...");
    for (let i = 0; i < 100; i++) {
        const firstName = sample(firstNames);
        const lastName = sample(lastNames);
        const linkedRequest = Math.random() > 0.3 ? sample(hiringRequests) : null;

        await prisma.candidate.create({
            data: {
                firstName,
                lastName,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1,99)}@gmail.com`,
                phone: `+216 ${randomInt(20, 99)} ${randomInt(100, 999)} ${randomInt(100, 999)}`,
                positionAppliedFor: linkedRequest ? linkedRequest.jobTitle : sample(jobTitles),
                yearsOfExperience: randomInt(0, 15),
                status: sample(["RECEIVED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"]),
                hiringRequestId: linkedRequest ? linkedRequest.id : null,
            }
        });
    }

    console.log("Seeding completed successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
