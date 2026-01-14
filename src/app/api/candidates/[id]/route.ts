import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const candidateId = parseInt(id);

    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: body,
    });

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

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}
