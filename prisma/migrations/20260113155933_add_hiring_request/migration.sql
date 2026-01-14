-- CreateTable
CREATE TABLE "HiringRequest" (
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
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);
