"use server";

// import { prisma } from "@/lib/db"; // DEPRECATED
// import { Prisma } from "@prisma/client"; // DEPRECATED

export type VacantPosition = any;

export async function getVacantPositions() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/vacant-positions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
        console.error("Failed to fetch vacant positions:", response.status, response.statusText);
        return { data: [] };
    }

    const result = await response.json();
    return { data: result.data || [] };
  } catch (error) {
    console.error("Error in getVacantPositions:", error);
    return { data: [] };
  }
}

export async function createVacantPosition(data: any) {
  console.warn("createVacantPosition (Server Action) is disabled. Using stub.");
  return { error: "Backend Migration in Progress" };
}

export async function updateVacantPosition(id: number, data: any) {
  console.warn("updateVacantPosition (Server Action) is disabled. Using stub.");
  return { error: "Backend Migration in Progress" };
}

export async function deleteVacantPosition(id: number) {
  console.warn("deleteVacantPosition (Server Action) is disabled. Using stub.");
  return { error: "Backend Migration in Progress" };
}

export async function getRecruiters() {
  console.warn("getRecruiters (Server Action) is disabled. Using stub.");
  return { data: [] };
}
