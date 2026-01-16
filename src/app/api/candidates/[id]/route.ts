import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
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

    const body = await request.json();
    const { id } = await params;
    const candidateId = parseInt(id);

    // Check if user is trying to modify opinions - only RH and Manager can do this
    if (body.hrOpinion !== undefined || body.managerOpinion !== undefined) {
      if (payload.role !== "RH" && payload.role !== "Manager") {
        return NextResponse.json(
          { error: "Seuls les utilisateurs RH et Manager peuvent modifier les avis" },
          { status: 403 }
        );
      }
    }

    // Get current candidate data to check opinions
    const currentCandidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: {
        status: true,
        hrOpinion: true,
        managerOpinion: true,
      },
    });

    if (!currentCandidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Determine new status based on opinions
    let newStatus = body.status || currentCandidate.status;
    const newHrOpinion = body.hrOpinion !== undefined ? body.hrOpinion : currentCandidate.hrOpinion;
    const newManagerOpinion = body.managerOpinion !== undefined ? body.managerOpinion : currentCandidate.managerOpinion;

    // Auto-update status based on favorable opinions
    if (body.hrOpinion !== undefined || body.managerOpinion !== undefined) {
      // If both opinions are FAVORABLE, set status to SELECTED
      if (newHrOpinion === "FAVORABLE" && newManagerOpinion === "FAVORABLE") {
        if (currentCandidate.status !== "SELECTED" && currentCandidate.status !== "HIRED") {
          newStatus = "SELECTED";
        }
      }
      // If only HR opinion is FAVORABLE and status is RECEIVED, set to SHORTLISTED
      else if (newHrOpinion === "FAVORABLE" && currentCandidate.status === "RECEIVED") {
        newStatus = "SHORTLISTED";
      }
      // If opinion becomes UNFAVORABLE and status is not already REJECTED, set to REJECTED
      else if ((newHrOpinion === "UNFAVORABLE" || newManagerOpinion === "UNFAVORABLE") && currentCandidate.status !== "REJECTED" && currentCandidate.status !== "HIRED") {
        newStatus = "REJECTED";
      }
    }

    // Get old status for history
    const oldStatus = currentCandidate.status;

    // Update candidate with new data and potentially new status
    const updateData: any = { ...body };
    if (newStatus !== currentCandidate.status && (body.hrOpinion !== undefined || body.managerOpinion !== undefined)) {
      updateData.status = newStatus;
    }

    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: updateData,
    });

    // Create status history if status changed (either manually or automatically from opinions)
    if (newStatus !== oldStatus) {
      try {
        const reason = body.statusChangeReason || (body.hrOpinion !== undefined || body.managerOpinion !== undefined 
          ? `Avis ${newHrOpinion === "FAVORABLE" && newManagerOpinion === "FAVORABLE" ? "RH et Manager favorables" : newHrOpinion === "FAVORABLE" ? "RH favorable" : newManagerOpinion === "FAVORABLE" ? "Manager favorable" : "défavorable"}`
          : undefined);
        await updateCandidateStatus(
          candidateId,
          newStatus,
          payload.userId,
          body.statusChangeComments,
          reason
        );
      } catch (error) {
        // If status history creation fails, log but don't fail the update
        console.log("Could not create status history:", error);
      }
    }

    // If candidate status changed to HIRED, close the associated hiring request
    if (newStatus === "HIRED" && candidate?.hiringRequestId) {
      try {
        await prisma.hiringRequest.update({
          where: { id: candidate.hiringRequestId },
          data: {
            status: "HIRED",
            actualHiringDate: new Date(),
          },
        });
        console.log(`Hiring request ${candidate.hiringRequestId} closed automatically because candidate ${candidateId} was hired`);
      } catch (error) {
        // Log error but don't fail the candidate update
        console.error("Error closing hiring request:", error);
      }
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateId = parseInt(id);

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        hiringRequest: {
          include: {
            recruiter: true,
          },
        },
        validations: {
          include: {
            validator: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        interviews: {
          include: {
            interviewer: true,
          },
          orderBy: {
            scheduledAt: 'desc',
          },
        },
        medicalVisit: true,
        jobOffer: true,
      },
    });

    // Try to fetch status history separately to avoid errors if table doesn't exist yet
    let statusHistory: any[] = [];
    try {
      // Use dynamic access to avoid TypeScript errors if model not generated yet
      const statusHistoryModel = (prisma as any).candidateStatusHistory;
      if (statusHistoryModel) {
        statusHistory = await statusHistoryModel.findMany({
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
            createdAt: 'desc',
          },
        });
      }
    } catch (error: any) {
      // Table might not exist yet or model not generated, ignore error
      console.log("Status history not available:", error?.message || "Unknown error");
    }

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...candidate,
      statusHistory,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}
