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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // RH, Manager, and CO can update employees
    const { error } = await requireAuth(request, ["RH", "Manager", "CO"]);
    if (error) return error;

    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();
        const { firstName, lastName, email, position } = body;

        const employee = await prisma.employee.update({
            where: { id },
            data: { firstName, lastName, email, position },
        });

        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Only CO can delete employees
    const { error } = await requireAuth(request, ["CO"]);
    if (error) return error;

    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        await prisma.employee.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
    }
}
