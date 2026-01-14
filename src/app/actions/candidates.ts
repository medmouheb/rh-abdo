"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

// Types
export type CandidateWithRelations = Prisma.CandidateGetPayload<{
  include: {
    hiringRequest: {
      include: {
        recruiter: true;
      };
    };
    validations: {
      include: {
        validator: true;
      };
    };
    interviews: {
      include: {
        interviewer: true;
      };
    };
    medicalVisit: true;
    jobOffer: true;
  };
}>;

// Get all candidates with filters
export async function getCandidates(filters?: {
  status?: string;
  department?: string;
  source?: string;
  hiringRequestId?: number;
}) {
  try {
    const where: Prisma.CandidateWhereInput = {};
    
    if (filters?.status) where.status = filters.status;
    if (filters?.department) where.department = filters.department;
    if (filters?.source) where.source = filters.source;
    if (filters?.hiringRequestId) where.hiringRequestId = filters.hiringRequestId;

    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        hiringRequest: {
          include: {
            recruiter: true,
          },
        },
        validations: {
          include: {
            validator: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        interviews: {
          include: {
            interviewer: true,
          },
          orderBy: {
            scheduledAt: 'desc',
          },
        },
        medicalVisit: true,
        jobOffer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: candidates };
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return { success: false, error: "Failed to fetch candidates" };
  }
}

// Get single candidate
export async function getCandidate(id: number) {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        hiringRequest: {
          include: {
            recruiter: true,
          },
        },
        validations: {
          include: {
            validator: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        interviews: {
          include: {
            interviewer: true,
          },
          orderBy: {
            scheduledAt: 'desc',
          },
        },
        medicalVisit: true,
        jobOffer: true,
      },
    });

    if (!candidate) {
      return { success: false, error: "Candidate not found" };
    }

    return { success: true, data: candidate };
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return { success: false, error: "Failed to fetch candidate" };
  }
}

// Create candidate
export async function createCandidate(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  positionAppliedFor: string;
  department?: string;
  source?: string;
  yearsOfExperience?: number;
  cvPath?: string;
  documentsPath?: string;
  recruiterComments?: string;
  hiringRequestId?: number;
  // New fields
  educationLevel?: string;
  familySituation?: string;
  studySpecialty?: string;
  currentSalary?: number;
  salaryExpectation?: number;
  proposedSalary?: number;
  noticePeriod?: string;
  hrOpinion?: string;
  managerOpinion?: string;
  recruitmentMode?: string;
  workSite?: string;
}) {
  try {
    const candidate = await prisma.candidate.create({
      data: {
        ...data,
        status: "RECEIVED",
      },
      include: {
        hiringRequest: true,
      },
    });

    revalidatePath("/candidates");
    return { success: true, data: candidate };
  } catch (error) {
    console.error("Error creating candidate:", error);
    return { success: false, error: "Failed to create candidate" };
  }
}

// Update candidate
export async function updateCandidate(id: number, data: Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  positionAppliedFor: string;
  department: string | null;
  source: string | null;
  yearsOfExperience: number | null;
  cvPath: string | null;
  documentsPath: string | null;
  recruiterComments: string | null;
  status: string;
  hiringRequestId: number | null;
  educationLevel: string | null;
  familySituation: string | null;
  studySpecialty: string | null;
  currentSalary: number | null;
  salaryExpectation: number | null;
  proposedSalary: number | null;
  noticePeriod: string | null;
  hrOpinion: string | null;
  managerOpinion: string | null;
  recruitmentMode: string | null;
  workSite: string | null;
  birthDate: Date | string | null;
  gender: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  level: string | null;
  specialty: string | null;
  language: string | null;
}>) {
  try {
    console.log("Updating candidate:", id, JSON.stringify(data, null, 2));
    const candidate = await prisma.candidate.update({
      where: { id },
      data,
    });

    revalidatePath("/candidates");
    revalidatePath(`/candidates/${id}`);
    return { success: true, data: candidate };
  } catch (error) {
    console.error("Error updating candidate:", error);
    // @ts-ignore
    if (error.code) console.error("Prisma error code:", error.code);
    // @ts-ignore
    if (error.meta) console.error("Prisma error meta:", error.meta);
    return { success: false, error: "Failed to update candidate" };
  }
}

// Delete candidate
export async function deleteCandidate(id: number) {
  try {
    await prisma.candidate.delete({
      where: { id },
    });

    revalidatePath("/candidates");
    return { success: true };
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return { success: false, error: "Failed to delete candidate" };
  }
}

// Add validation
export async function addValidation(data: {
  candidateId: number;
  validatorId: number;
  stage: string;
  decision: string;
  comments?: string;
  selectionCriteria?: string;
  observations?: string;
}) {
  try {
    const validation = await prisma.candidateValidation.create({
      data,
      include: {
        validator: true,
      },
    });

    // Update candidate status based on stage
    let newStatus = "RECEIVED";
    if (data.stage === "SHORTLIST" && data.decision === "APPROVED") {
      newStatus = "SHORTLISTED";
    } else if (data.stage === "FINAL_SELECTION" && data.decision === "APPROVED") {
      newStatus = "SELECTED";
    }

    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: newStatus },
    });

    revalidatePath("/candidates");
    revalidatePath(`/candidates/${data.candidateId}`);
    return { success: true, data: validation };
  } catch (error) {
    console.error("Error adding validation:", error);
    return { success: false, error: "Failed to add validation" };
  }
}

// Schedule interview
export async function scheduleInterview(data: {
  candidateId: number;
  type: string;
  scheduledAt: Date;
  interviewerId?: number;
  juryMembers?: string;
}) {
  try {
    const interview = await prisma.interview.create({
      data,
      include: {
        interviewer: true,
      },
    });

    // Update candidate status
    const newStatus = data.type === "TECHNICAL" ? "TECHNICAL_INTERVIEW" : "HR_INTERVIEW";
    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: newStatus },
    });

    revalidatePath("/candidates");
    revalidatePath(`/candidates/${data.candidateId}`);
    return { success: true, data: interview };
  } catch (error) {
    console.error("Error scheduling interview:", error);
    return { success: false, error: "Failed to schedule interview" };
  }
}

// Update interview result
export async function updateInterviewResult(
  interviewId: number,
  data: {
    result: string;
    comments?: string;
    recommendations?: string;
  }
) {
  try {
    const interview = await prisma.interview.update({
      where: { id: interviewId },
      data,
    });

    revalidatePath("/candidates");
    return { success: true, data: interview };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { success: false, error: "Failed to update interview" };
  }
}

// Add medical visit
export async function addMedicalVisit(data: {
  candidateId: number;
  visitDate: Date;
  result: string;
  observations?: string;
}) {
  try {
    const medicalVisit = await prisma.medicalVisit.create({
      data,
    });

    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: "MEDICAL_VISIT" },
    });

    revalidatePath("/candidates");
    revalidatePath(`/candidates/${data.candidateId}`);
    return { success: true, data: medicalVisit };
  } catch (error) {
    console.error("Error adding medical visit:", error);
    return { success: false, error: "Failed to add medical visit" };
  }
}

// Send job offer
export async function sendJobOffer(data: {
  candidateId: number;
  sentDate: Date;
  hrSignature?: string;
}) {
  try {
    const jobOffer = await prisma.jobOffer.create({
      data: {
        ...data,
        response: "PENDING",
      },
    });

    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: "OFFER_SENT" },
    });

    revalidatePath("/candidates");
    revalidatePath(`/candidates/${data.candidateId}`);
    return { success: true, data: jobOffer };
  } catch (error) {
    console.error("Error sending job offer:", error);
    return { success: false, error: "Failed to send job offer" };
  }
}

// Update job offer response
export async function updateJobOfferResponse(
  offerId: number,
  data: {
    response: string;
    responseDate: Date;
    actualHiringDate?: Date;
  }
) {
  try {
    const jobOffer = await prisma.jobOffer.update({
      where: { id: offerId },
      data,
      include: {
        candidate: true,
      },
    });

    // Update candidate status
    if (data.response === "ACCEPTED") {
      await prisma.candidate.update({
        where: { id: jobOffer.candidateId },
        data: { status: "HIRED" },
      });
    } else if (data.response === "REJECTED") {
      await prisma.candidate.update({
        where: { id: jobOffer.candidateId },
        data: { status: "REJECTED" },
      });
    }

    revalidatePath("/candidates");
    return { success: true, data: jobOffer };
  } catch (error) {
    console.error("Error updating job offer:", error);
    return { success: false, error: "Failed to update job offer" };
  }
}

// Get candidate statistics
export async function getCandidateStatistics() {
  try {
    const [
      total,
      received,
      shortlisted,
      inInterview,
      selected,
      hired,
      rejected,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.count({ where: { status: "RECEIVED" } }),
      prisma.candidate.count({ where: { status: "SHORTLISTED" } }),
      prisma.candidate.count({ 
        where: { 
          status: { in: ["TECHNICAL_INTERVIEW", "HR_INTERVIEW"] } 
        } 
      }),
      prisma.candidate.count({ where: { status: "SELECTED" } }),
      prisma.candidate.count({ where: { status: "HIRED" } }),
      prisma.candidate.count({ where: { status: "REJECTED" } }),
    ]);

    return {
      success: true,
      data: {
        total,
        received,
        shortlisted,
        inInterview,
        selected,
        hired,
        rejected,
        conversionRate: total > 0 ? ((hired / total) * 100).toFixed(2) : 0,
      },
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
