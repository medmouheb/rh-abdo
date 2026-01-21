// import { prisma } from "@/lib/db"; // DEPRECATED: Prisma Removed
// Logic moved to Backend Mongoose

/**
 * Status labels mapping (French labels for display)
 */
export const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Traitement dossier",
  SHORTLISTED: "Présélectionné",
  TECHNICAL_INTERVIEW: "Entretien Technique",
  HR_INTERVIEW: "Entretien RH",
  SELECTED: "Validation direction",
  MEDICAL_VISIT: "Visite médicale",
  OFFER_SENT: "Offre envoyée",
  HIRED: "Validé",
  REJECTED: "Refus",
  PENDING: "En attente",
};

/**
 * Create a status history entry when candidate status changes
 */
export async function createStatusHistory(
  candidateId: number,
  newStatus: string,
  oldStatus: string | null,
  changedBy: number,
  comments?: string,
  reason?: string
) {
  console.warn("createStatusHistory called on frontend - logic should be on backend");
  return null;
}

/**
 * Get status history for a candidate
 */
export async function getCandidateStatusHistory(candidateId: number) {
  console.warn("getCandidateStatusHistory called on frontend - logic should be on backend");
  return [];
}

/**
 * Update candidate status and create history entry
 */
export async function updateCandidateStatus(
  candidateId: number,
  newStatus: string,
  changedBy: number,
  comments?: string,
  reason?: string
) {
  console.warn("updateCandidateStatus called on frontend - logic should be on backend");
  return { success: true };
}
