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

        if (body.comments !== undefined) {
            updateData.comments = body.comments;
        }

        // Multi-step Validation Handling
        if (body.action) {
            const currentRequest = await prisma.hiringRequest.findUnique({
                where: { id: hiringRequestId }
            });

            if (currentRequest) {
                // Apply specific validation
                if (body.action === 'VALIDATE_RH') updateData.validationRHStatus = body.decision;
                if (body.action === 'VALIDATE_MANAGER') updateData.validationPlantManagerStatus = body.decision;
                if (body.action === 'VALIDATE_RECRUITMENT') updateData.validationRecruitmentStatus = body.decision;

                // Check overall status
                const sRH = updateData.validationRHStatus || (currentRequest as any).validationRHStatus || 'PENDING';
                const sManager = updateData.validationPlantManagerStatus || (currentRequest as any).validationPlantManagerStatus || 'PENDING';
                const sRec = updateData.validationRecruitmentStatus || (currentRequest as any).validationRecruitmentStatus || 'PENDING';

                if (body.decision === 'REJECTED') {
                    updateData.status = 'CANCELLED';
                } else if (sRH === 'APPROVED' && sManager === 'APPROVED' && sRec === 'APPROVED') {
                    updateData.status = 'VACANT';
                }
                // If still pending, status remains PENDING_VALIDATION (or whatever it is)

                // --- Notification Logic ---
                try {
                    // 1. Refusal -> Notify Creator (Demandeur)
                    if (body.decision === 'REJECTED' && currentRequest.recruiterId) {
                         // Extract simple reason if possible, or use full comment
                         const reason = body.comments || 'Non spécifiée';
                         
                         await prisma.notification.create({
                            data: {
                                userId: currentRequest.recruiterId,
                                type: 'HIRING_REQUEST_REJECTED',
                                title: 'Demande Refusée',
                                message: `Votre demande pour "${currentRequest.jobTitle}" a été refusée (${body.action}). Raison: ${reason}`,
                                relatedId: hiringRequestId,
                                relatedType: 'hiringRequest',
                                createdBy: payload.userId,
                            }
                         });
                    }
                    
                    // 2. Approval Transitions
                    if (body.decision === 'APPROVED') {
                        // RH Validated -> Notify Plant Managers
                        if (body.action === 'VALIDATE_RH') {
                             const managers = await prisma.user.findMany({ where: { role: 'Manager' }, select: { id: true } });
                             if (managers.length > 0) {
                                 await Promise.all(managers.map(m => 
                                     prisma.notification.create({
                                         data: {
                                             userId: m.id,
                                             type: 'VALIDATION_REQUIRED',
                                             title: 'Validation Requise (Plant Manager)',
                                             message: `Validation RH effectuée pour "${currentRequest.jobTitle}". Votre validation est attendue.`,
                                             relatedId: hiringRequestId,
                                             relatedType: 'hiringRequest',
                                             createdBy: payload.userId,
                                         }
                                     })
                                 ));
                             }
                        }
                        
                        // Manager Validated -> Notify Recruitment (RH users)
                        if (body.action === 'VALIDATE_MANAGER') {
                             const rhUsers = await prisma.user.findMany({ where: { role: 'RH' }, select: { id: true } });
                             if (rhUsers.length > 0) {
                                 await Promise.all(rhUsers.map(rh => 
                                     prisma.notification.create({
                                         data: {
                                             userId: rh.id,
                                             type: 'VALIDATION_REQUIRED',
                                             title: 'Validation Requise (Resp. Recrutement)',
                                             message: `Validation Plant Manager effectuée pour "${currentRequest.jobTitle}". Validation finale attendue.`,
                                             relatedId: hiringRequestId, // Using original ID
                                             relatedType: 'hiringRequest',
                                             createdBy: payload.userId,
                                         }
                                     })
                                 ));
                             }
                        }
                    }
                } catch (notifError) {
                     console.error("Notification Error:", notifError);
                }
            }
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
