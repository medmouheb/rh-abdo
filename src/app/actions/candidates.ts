"use server";

// import { prisma } from "@/lib/db"; // DEPRECATED
import { revalidatePath } from "next/cache";
// import type { Prisma } from "@prisma/client"; // DEPRECATED

// Types
// Stubbing CandidateWithRelations as any to avoid Prisma dependency
export type CandidateWithRelations = any;

// Get all candidates with filters
export async function getCandidates(filters?: {
  status?: string;
  department?: string;
  source?: string;
  hiringRequestId?: number;
}) {
  console.warn("getCandidates (Server Action) is disabled. Using stub. Please migrate to Backend API.");
  return { success: true, data: [] };
}

// Get single candidate
export async function getCandidate(id: number) {
  console.warn("getCandidate (Server Action) is disabled. Using stub.");
  return { success: false, error: "Backend Migration in Progress" };
}

// Create candidate
export async function createCandidate(data: any) {
    console.warn("createCandidate (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Update candidate
export async function updateCandidate(
  id: number, 
  data: any,
  changedBy?: number,
  statusChangeReason?: string
) {
    console.warn("updateCandidate (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Delete candidate
export async function deleteCandidate(id: number) {
    console.warn("deleteCandidate (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Add validation
export async function addValidation(data: any) {
    console.warn("addValidation (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Schedule interview
export async function scheduleInterview(data: any) {
    console.warn("scheduleInterview (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Update interview result
export async function updateInterviewResult(
  interviewId: number,
  data: any,
  createdBy?: number
) {
    console.warn("updateInterviewResult (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Add medical visit
export async function addMedicalVisit(data: any) {
    console.warn("addMedicalVisit (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Send job offer
export async function sendJobOffer(data: any) {
    console.warn("sendJobOffer (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Update job offer response
export async function updateJobOfferResponse(
  offerId: number,
  data: any
) {
    console.warn("updateJobOfferResponse (Server Action) is disabled. Using stub.");
    return { success: false, error: "Backend Migration in Progress" };
}

// Get candidate statistics
export async function getCandidateStatistics() {
    console.warn("getCandidateStatistics (Server Action) is disabled. Using stub.");
    return {
      success: true,
      data: {
        total: 0,
        received: 0,
        shortlisted: 0,
        inInterview: 0,
        selected: 0,
        hired: 0,
        rejected: 0,
        conversionRate: 0,
      },
    };
}
