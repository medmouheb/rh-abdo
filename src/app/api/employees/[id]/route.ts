import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_local_dev";

export const dynamic = "force-dynamic";

async function verifyAuth(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const decoded = await verifyAuth(request);
    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const decoded = await verifyAuth(request);
    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
