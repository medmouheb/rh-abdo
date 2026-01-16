import { prisma } from "@/lib/db";

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
  try {
    // Use dynamic access to avoid TypeScript errors if model not generated yet
    const statusHistoryModel = (prisma as any).candidateStatusHistory;
    if (!statusHistoryModel) {
      console.log("Status history model not available, skipping history creation");
      return null;
    }

    const statusHistory = await statusHistoryModel.create({
      data: {
        candidateId,
        oldStatus: oldStatus || null,
        newStatus,
        statusLabel: STATUS_LABELS[newStatus] || newStatus,
        changedBy,
        comments: comments || null,
        reason: reason || null,
      },
      include: {
        changedByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return statusHistory;
  } catch (error) {
    console.error("Error creating status history:", error);
    throw error;
  }
}

/**
 * Get status history for a candidate
 */
export async function getCandidateStatusHistory(candidateId: number) {
  try {
    // Use dynamic access to avoid TypeScript errors if model not generated yet
    const statusHistoryModel = (prisma as any).candidateStatusHistory;
    if (!statusHistoryModel) {
      return [];
    }

    const history = await statusHistoryModel.findMany({
      where: { candidateId },
      include: {
        changedByUser: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return history;
  } catch (error) {
    console.error("Error fetching status history:", error);
    throw error;
  }
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
  try {
    // Get current status
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: { status: true },
    });

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const oldStatus = candidate.status;

    // Only create history if status actually changed
    if (oldStatus !== newStatus) {
      // Update candidate status
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { status: newStatus },
      });

      // Create history entry (may fail if table doesn't exist yet, but that's ok)
      try {
        await createStatusHistory(
          candidateId,
          newStatus,
          oldStatus,
          changedBy,
          comments,
          reason
        );
      } catch (error) {
        // If history creation fails, log but don't fail the status update
        console.log("Could not create status history entry:", error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating candidate status:", error);
    throw error;
  }
}
