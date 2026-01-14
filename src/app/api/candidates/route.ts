import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const candidate = await prisma.candidate.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        positionAppliedFor: body.positionAppliedFor,
        yearsOfExperience: body.yearsOfExperience ? parseInt(body.yearsOfExperience) : undefined,
        status: body.status || "RECEIVED",
        hiringRequestId: body.hiringRequestId ? parseInt(body.hiringRequestId) : undefined,
      },
    });

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hiringRequestId = searchParams.get("hiringRequestId");

    const candidates = await prisma.candidate.findMany({
      where: hiringRequestId ? { hiringRequestId: parseInt(hiringRequestId) } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        hiringRequest: {
          select: { jobTitle: true }
        }
      }
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
