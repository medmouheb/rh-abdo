-- CreateTable
CREATE TABLE "Candidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "positionAppliedFor" TEXT NOT NULL,
    "yearsOfExperience" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "hiringRequestId" INTEGER,
    CONSTRAINT "Candidate_hiringRequestId_fkey" FOREIGN KEY ("hiringRequestId") REFERENCES "HiringRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
