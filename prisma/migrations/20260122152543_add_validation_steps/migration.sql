-- DropIndex
DROP INDEX "CandidateStatusHistory_changedBy_idx";

-- DropIndex
DROP INDEX "CandidateStatusHistory_newStatus_idx";

-- DropIndex
DROP INDEX "CandidateStatusHistory_candidateId_idx";

-- DropIndex
DROP INDEX "Notification_type_idx";

-- DropIndex
DROP INDEX "Notification_isRead_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN "address" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "birthDate" DATETIME;
ALTER TABLE "Candidate" ADD COLUMN "city" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "country" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "currentSalary" REAL;
ALTER TABLE "Candidate" ADD COLUMN "cvPath" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "department" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "documentsPath" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "educationLevel" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "familySituation" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "gender" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "hrOpinion" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "language" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "level" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "managerOpinion" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "noticePeriod" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "proposedSalary" REAL;
ALTER TABLE "Candidate" ADD COLUMN "recruiterComments" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "recruitmentMode" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "salaryExpectation" REAL;
ALTER TABLE "Candidate" ADD COLUMN "source" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "specialty" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "studySpecialty" TEXT;
ALTER TABLE "Candidate" ADD COLUMN "workSite" TEXT;

-- CreateTable
CREATE TABLE "CandidateValidation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" INTEGER NOT NULL,
    "validatorId" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comments" TEXT,
    "selectionCriteria" TEXT,
    "observations" TEXT,
    CONSTRAINT "CandidateValidation_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateValidation_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "interviewerId" INTEGER,
    "juryMembers" TEXT,
    "result" TEXT,
    "comments" TEXT,
    "recommendations" TEXT,
    CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalVisit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" INTEGER NOT NULL,
    "visitDate" DATETIME NOT NULL,
    "result" TEXT NOT NULL,
    "observations" TEXT,
    CONSTRAINT "MedicalVisit_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" INTEGER NOT NULL,
    "sentDate" DATETIME NOT NULL,
    "response" TEXT,
    "responseDate" DATETIME,
    "actualHiringDate" DATETIME,
    "hrSignature" TEXT,
    "signatureDate" DATETIME,
    CONSTRAINT "JobOffer_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HiringRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "requestDate" DATETIME,
    "personnelType" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "workLocation" TEXT NOT NULL,
    "businessUnit" TEXT,
    "jobTitle" TEXT NOT NULL,
    "desiredHiringDate" DATETIME,
    "reason" TEXT NOT NULL,
    "replacementName" TEXT,
    "departureReason" TEXT,
    "dateRangeStart" DATETIME,
    "dateRangeEnd" DATETIME,
    "contractType" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "jobCharacteristics" TEXT NOT NULL,
    "candidateEducation" TEXT NOT NULL,
    "candidateSkills" TEXT NOT NULL,
    "recruiterId" INTEGER,
    "recruitmentSource" TEXT,
    "recruitmentMode" TEXT NOT NULL DEFAULT 'EXTERNAL',
    "comments" TEXT,
    "hiringCost" REAL,
    "processDuration" INTEGER,
    "performanceRatio" REAL,
    "actualHiringDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VALIDATION',
    "validationRHStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "validationPlantManagerStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "validationRecruitmentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "HiringRequest_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_HiringRequest" ("businessUnit", "candidateEducation", "candidateSkills", "contractType", "createdAt", "dateRangeEnd", "dateRangeStart", "departureReason", "desiredHiringDate", "id", "jobCharacteristics", "jobTitle", "justification", "personnelType", "reason", "replacementName", "requestDate", "service", "status", "updatedAt", "workLocation") SELECT "businessUnit", "candidateEducation", "candidateSkills", "contractType", "createdAt", "dateRangeEnd", "dateRangeStart", "departureReason", "desiredHiringDate", "id", "jobCharacteristics", "jobTitle", "justification", "personnelType", "reason", "replacementName", "requestDate", "service", "status", "updatedAt", "workLocation" FROM "HiringRequest";
DROP TABLE "HiringRequest";
ALTER TABLE "new_HiringRequest" RENAME TO "HiringRequest";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'RH'
);
INSERT INTO "new_User" ("id", "password", "username") SELECT "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalVisit_candidateId_key" ON "MedicalVisit"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "JobOffer_candidateId_key" ON "JobOffer"("candidateId");
