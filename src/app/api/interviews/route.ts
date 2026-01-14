import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, date, time, type, notes } = body;

    // Validate required fields
    if (!candidateId || !date || !time || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Combine date and time into a single DateTime
    const scheduledAt = new Date(`${date}T${time}:00`);

    // Create the interview
    const interview = await prisma.interview.create({
      data: {
        candidateId: parseInt(candidateId),
        type,
        scheduledAt,
        comments: notes || null,
        result: "PENDING",
      },
      include: {
        candidate: true,
        interviewer: true,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error("Interview creation error:", error);
    return NextResponse.json(
      { error: "Failed to schedule interview" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");

    const where = candidateId ? { candidateId: parseInt(candidateId) } : {};

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        candidate: true,
        interviewer: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Fetch interviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
