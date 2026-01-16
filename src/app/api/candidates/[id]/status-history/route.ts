import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { getCandidateStatusHistory } from "@/lib/status-history";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const payload = await verifyAuth(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const history = await getCandidateStatusHistory(parseInt(id));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching status history:", error);
    return NextResponse.json(
      { error: "Failed to fetch status history" },
      { status: 500 }
    );
  }
}
