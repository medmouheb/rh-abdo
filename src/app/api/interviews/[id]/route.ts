import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { notifyInterviewValidation } from "@/lib/notifications";
import { updateCandidateStatus } from "@/lib/status-history";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { result, comments, recommendations } = body;

    // Get the interview with candidate info
    const interview = await prisma.interview.findUnique({
      where: { id: parseInt(id) },
      include: {
        candidate: true,
        interviewer: true,
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Update the interview result
    const updatedInterview = await prisma.interview.update({
      where: { id: parseInt(id) },
      data: {
        result,
        comments: comments || null,
        recommendations: recommendations || null,
      },
      include: {
        candidate: true,
        interviewer: true,
      },
    });

    // Update candidate status based on interview result
    if (result === "ADMITTED") {
      // Determine new status based on interview type
      const newStatus = interview.type === "TECHNICAL" 
        ? "TECHNICAL_INTERVIEW" 
        : "HR_INTERVIEW";
      
      // Update candidate status with history
      await updateCandidateStatus(
        interview.candidateId,
        newStatus,
        payload.userId,
        comments || undefined,
        `Entretien ${interview.type === "TECHNICAL" ? "Technique" : "RH"} validé`
      );

      // Create notifications for CO and RH
      await notifyInterviewValidation(
        interview.id,
        interview.type as "TECHNICAL" | "HR",
        `${interview.candidate.firstName} ${interview.candidate.lastName}`,
        interview.candidate.positionAppliedFor,
        payload.userId
      );
    } else if (result === "REJECTED") {
      // Update to rejected status
      await updateCandidateStatus(
        interview.candidateId,
        "REJECTED",
        payload.userId,
        comments || undefined,
        `Entretien ${interview.type === "TECHNICAL" ? "Technique" : "RH"} refusé`
      );
    }

    return NextResponse.json(updatedInterview);
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 }
    );
  }
}
