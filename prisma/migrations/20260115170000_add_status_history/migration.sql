-- CreateTable
CREATE TABLE "CandidateStatusHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" INTEGER NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "statusLabel" TEXT NOT NULL,
    "changedBy" INTEGER,
    "comments" TEXT,
    "reason" TEXT,
    CONSTRAINT "CandidateStatusHistory_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateStatusHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CandidateStatusHistory_candidateId_idx" ON "CandidateStatusHistory"("candidateId");
CREATE INDEX "CandidateStatusHistory_newStatus_idx" ON "CandidateStatusHistory"("newStatus");
CREATE INDEX "CandidateStatusHistory_changedBy_idx" ON "CandidateStatusHistory"("changedBy");
