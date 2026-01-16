import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Remove a candidate from a hiring request
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; candidateId: string }> }
) {
    const payload = await verifyAuth(request);
    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, candidateId } = await params;
        const hiringRequestId = parseInt(id);
        const candidateIdNum = parseInt(candidateId);

        // Remove the candidate from this hiring request by setting hiringRequestId to null
        const updatedCandidate = await prisma.candidate.update({
            where: { id: candidateIdNum },
            data: { hiringRequestId: null },
        });

        return NextResponse.json({ 
            success: true, 
            message: "Candidate removed from position",
            candidate: updatedCandidate 
        });
    } catch (error) {
        console.error("Error removing candidate:", error);
        return NextResponse.json(
            { error: "Failed to remove candidate" },
            { status: 500 }
        );
    }
}
