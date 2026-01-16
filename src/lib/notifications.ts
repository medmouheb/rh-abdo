import { prisma } from "@/lib/db";

/**
 * Create notifications for CO and RH users when a candidate is validated in an interview
 */
export async function notifyInterviewValidation(
  interviewId: number,
  interviewType: "TECHNICAL" | "HR",
  candidateName: string,
  positionAppliedFor: string,
  createdBy: number
) {
  try {
    // Get all CO and RH users
    const coAndRhUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ["CO", "RH"],
        },
      },
    });

    // Create notifications for each CO and RH user
    const notifications = await Promise.all(
      coAndRhUsers.map((user) =>
        prisma.notification.create({
          data: {
            userId: user.id,
            type: "INTERVIEW_VALIDATED",
            title: `Candidat validé en entretien ${interviewType === "TECHNICAL" ? "Technique" : "RH"}`,
            message: `Le candidat ${candidateName} a été validé en entretien ${interviewType === "TECHNICAL" ? "Technique" : "RH"} pour le poste de ${positionAppliedFor}.`,
            relatedId: interviewId,
            relatedType: "interview",
            createdBy: createdBy,
          },
        })
      )
    );

    console.log(`✅ Created ${notifications.length} notifications for interview validation`);
    return notifications;
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw error;
  }
}

/**
 * Create notification for a specific user
 */
export async function createNotification(data: {
  userId: number;
  type: string;
  title: string;
  message: string;
  relatedId?: number;
  relatedType?: string;
  createdBy?: number;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        relatedId: data.relatedId || null,
        relatedType: data.relatedType || null,
        createdBy: data.createdBy || null,
      },
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}
