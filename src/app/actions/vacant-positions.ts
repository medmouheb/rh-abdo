"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type VacantPosition = Prisma.HiringRequestGetPayload<{
  include: {
    candidates: true;
    recruiter: true;
  };
}>;

export async function getVacantPositions() {
  try {
    const vacantPositions = await prisma.hiringRequest.findMany({
      include: {
        candidates: true,
        recruiter: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { data: vacantPositions };
  } catch (error) {
    console.error("Error fetching vacant positions:", error);
    return { error: "Failed to fetch vacant positions" };
  }
}

export async function createVacantPosition(data: any) {
  try {
    const { recruiterId, ...rest } = data;
    const newPosition = await prisma.hiringRequest.create({
      data: {
        ...rest,
        recruiter: recruiterId ? { connect: { id: parseInt(recruiterId) } } : undefined,
      },
    });
    revalidatePath("/vacant-positions");
    return { success: true, data: newPosition };
  } catch (error) {
    console.error("Error creating vacant position:", error);
    return { error: "Failed to create vacant position" };
  }
}

export async function updateVacantPosition(id: number, data: any) {
  try {
    const { recruiterId, ...rest } = data;
    const updatedPosition = await prisma.hiringRequest.update({
      where: { id },
      data: {
        ...rest,
        recruiter: recruiterId ? { connect: { id: parseInt(recruiterId) } } : { disconnect: true },
      },
    });
    revalidatePath("/vacant-positions");
    return { success: true, data: updatedPosition };
  } catch (error) {
    console.error("Error updating vacant position:", error);
    return { error: "Failed to update vacant position" };
  }
}

export async function deleteVacantPosition(id: number) {
  try {
    await prisma.hiringRequest.delete({
      where: { id },
    });
    revalidatePath("/vacant-positions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting vacant position:", error);
    return { error: "Failed to delete vacant position" };
  }
}

export async function getRecruiters() {
  try {
    const recruiters = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      }
    });
    return { data: recruiters };
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return { error: "Failed to fetch recruiters" };
  }
}
