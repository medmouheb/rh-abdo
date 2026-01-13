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

export async function GET(request: Request) {
    const decoded = await verifyAuth(request);
    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const employees = await prisma.employee.findMany();
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const decoded = await verifyAuth(request);
    if (!decoded) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
