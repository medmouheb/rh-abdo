import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { UserRole } from "@/types/auth";

export const dynamic = "force-dynamic";

async function requireAuth(request: Request, allowedRoles?: UserRole[]) {
    const payload = await verifyAuth(request);
    if (!payload) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
    }
    
    if (allowedRoles && !allowedRoles.includes(payload.role)) {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), user: null };
    }
    
    return { error: null, user: payload };
}

export async function GET(request: Request) {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        
        // Build where clause based on user role
        const where: any = {};
        
        // RH can see all requests
        // Manager and CO see only requests they created (via recruiterId)
        if (user?.role !== "RH") {
            // Get user's created requests (where they are the recruiter)
            where.recruiterId = user?.userId;
        }
        // If RH, where clause remains empty to get all requests

        const hiringRequests = await prisma.hiringRequest.findMany({
            where,
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
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(hiringRequests);
    } catch (error) {
        console.error("Error fetching hiring requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch hiring requests" },
            { status: 500 }
        );
    }
}
