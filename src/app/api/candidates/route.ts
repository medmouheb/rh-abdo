import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { UserRole } from "@/types/auth";

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

export async function POST(request: Request) {
  // Only RH can create candidates (CO restricted as per request)
  const { error } = await requireAuth(request, ["RH"]);
  if (error) return error;

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
  const { error, user } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const hiringRequestId = searchParams.get("hiringRequestId");
    const where: any = {};

    if (hiringRequestId) {
        where.hiringRequestId = parseInt(hiringRequestId);
    }

    // Strict Restriction for CO: Only see candidates for purely THEIR requests
    if (user?.role === "CO") {
        where.hiringRequest = {
            recruiterId: user.userId
        };
    }

    const candidates = await prisma.candidate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        hiringRequest: {
          select: { jobTitle: true, recruiterId: true }
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
