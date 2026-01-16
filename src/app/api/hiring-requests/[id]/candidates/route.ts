import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Add a candidate to a hiring request
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const payload = await verifyAuth(request);
    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const hiringRequestId = parseInt(id);
        const { candidateId } = await request.json();

        if (!candidateId) {
            return NextResponse.json(
                { error: "Candidate ID is required" },
                { status: 400 }
            );
        }

        // Update the candidate's hiringRequestId
        const updatedCandidate = await prisma.candidate.update({
            where: { id: candidateId },
            data: { hiringRequestId },
        });

        return NextResponse.json(updatedCandidate);
    } catch (error) {
        console.error("Error adding candidate:", error);
        return NextResponse.json(
            { error: "Failed to add candidate" },
            { status: 500 }
        );
    }
}

// Get all candidates for a hiring request
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const payload = await verifyAuth(request);
    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const hiringRequestId = parseInt(id);

        const candidates = await prisma.candidate.findMany({
            where: { hiringRequestId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                status: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
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
