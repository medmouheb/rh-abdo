import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Get a single hiring request by ID
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

        const hiringRequest = await prisma.hiringRequest.findUnique({
            where: { id: hiringRequestId },
            include: {
                recruiter: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                candidates: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!hiringRequest) {
            return NextResponse.json(
                { error: "Hiring request not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(hiringRequest);
    } catch (error) {
        console.error("Error fetching hiring request:", error);
        return NextResponse.json(
            { error: "Failed to fetch hiring request" },
            { status: 500 }
        );
    }
}

// Update hiring request (budget, responsible, etc.)
export async function PATCH(
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
        const body = await request.json();

        // Extract allowed fields for update
        const updateData: any = {};

        if (body.budget !== undefined) {
            updateData.hiringCost = body.budget;
        }

        if (body.recruiterId !== undefined) {
            updateData.recruiterId = body.recruiterId;
        }

        if (body.status !== undefined) {
            updateData.status = body.status;
        }

        if (body.workLocation !== undefined) {
            updateData.workLocation = body.workLocation;
        }

        if (body.contractType !== undefined) {
            updateData.contractType = body.contractType;
        }

        // Update the hiring request
        const updatedRequest = await prisma.hiringRequest.update({
            where: { id: hiringRequestId },
            data: updateData,
            include: {
                recruiter: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                candidates: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("Error updating hiring request:", error);
        return NextResponse.json(
            { error: "Failed to update hiring request" },
            { status: 500 }
        );
    }
}

// Delete hiring request
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const payload = await verifyAuth(request);
    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only RH can delete hiring requests
    if (payload.role !== "RH") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = await params;
        const hiringRequestId = parseInt(id);

        await prisma.hiringRequest.delete({
            where: { id: hiringRequestId },
        });

        return NextResponse.json({ 
            success: true, 
            message: "Hiring request deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting hiring request:", error);
        return NextResponse.json(
            { error: "Failed to delete hiring request" },
            { status: 500 }
        );
    }
}
