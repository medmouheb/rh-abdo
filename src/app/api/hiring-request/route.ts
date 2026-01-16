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
  // RH, Manager, and CO can create hiring requests
  const { error, user } = await requireAuth(request, ["RH", "Manager", "CO"]);
  if (error) return error;

  try {
    const body = await request.json();
    
    // We can add validation here (e.g., Zod) later.
    // For now, straightforward mapping.

    const hiringRequest = await prisma.hiringRequest.create({
      data: {
        requestDate: body.requestDate ? new Date(body.requestDate) : undefined,
        personnelType: body.personnelType, // "OUVRIER", "ETAM", "CADRE"
        service: body.service,
        workLocation: body.workLocation,
        businessUnit: body.businessUnit,
        jobTitle: body.jobTitle,
        desiredHiringDate: body.desiredHiringDate ? new Date(body.desiredHiringDate) : undefined,
        reason: body.reason, // "REPLACEMENT", "BUDGETED", "NON_BUDGETED"
        replacementName: body.replacementName,
        departureReason: body.departureReason,
        dateRangeStart: body.dateRangeStart ? new Date(body.dateRangeStart) : undefined,
        dateRangeEnd: body.dateRangeEnd ? new Date(body.dateRangeEnd) : undefined,
        contractType: body.contractType, // "CDI", "CDD"
        justification: body.justification,
        jobCharacteristics: body.jobCharacteristics,
        candidateEducation: body.candidateEducation,
        candidateSkills: body.candidateSkills,
        recruiterId: user?.userId,
      },
    });

    return NextResponse.json(hiringRequest);
  } catch (error) {
    console.error("Error creating hiring request:", error);
    return NextResponse.json(
      { error: "Failed to create hiring request" },
      { status: 500 }
    );
  }
}
