import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
