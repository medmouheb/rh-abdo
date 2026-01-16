import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only RH and Manager can assign candidates
    if (payload.role !== "RH" && payload.role !== "Manager") {
      return NextResponse.json(
        { error: "Seuls les utilisateurs RH et Manager peuvent assigner des candidatures" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const hiringRequestId = parseInt(id);
    const body = await request.json();
    const { candidateId } = body;

    if (!candidateId) {
      return NextResponse.json(
        { error: "candidateId is required" },
        { status: 400 }
      );
    }

    // Verify hiring request exists
    const hiringRequest = await prisma.hiringRequest.findUnique({
      where: { id: hiringRequestId },
    });

    if (!hiringRequest) {
      return NextResponse.json(
        { error: "Hiring request not found" },
        { status: 404 }
      );
    }

    // Don't allow assigning if position is already HIRED or COMPLETED
    if (hiringRequest.status === "HIRED" || hiringRequest.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Cette position est déjà fermée (HIRED ou COMPLETED)" },
        { status: 400 }
      );
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Assign candidate to hiring request
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        hiringRequestId,
      },
      include: {
        hiringRequest: true,
      },
    });

    // Update hiring request status to IN_PROGRESS if it's still VACANT
    if (hiringRequest.status === "VACANT") {
      await prisma.hiringRequest.update({
        where: { id: hiringRequestId },
        data: {
          status: "IN_PROGRESS",
        },
      });
    }

    return NextResponse.json({
      success: true,
      candidate: updatedCandidate,
      message: "Candidature assignée avec succès",
    });
  } catch (error) {
    console.error("Error assigning candidate:", error);
    return NextResponse.json(
      { error: "Failed to assign candidate" },
      { status: 500 }
    );
  }
}
