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
        const employees = await prisma.employee.findMany();
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Only RH and CO can create employees
    const { error, user } = await requireAuth(request, ["RH", "CO"]);
    if (error) return error;

    try {
        const body = await request.json();
        const { firstName, lastName, email, position } = body;

        if (!firstName || !lastName || !email || !position) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const employee = await prisma.employee.create({
            data: { firstName, lastName, email, position },
        });

        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
    }
}
