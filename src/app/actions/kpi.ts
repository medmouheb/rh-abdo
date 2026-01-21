"use server";

// import { prisma } from "@/lib/db"; // DEPRECATED
// import { Prisma } from "@prisma/client"; // DEPRECATED

export async function getKPIDashboardData(year?: number) {
  console.warn("getKPIDashboardData (Server Action) is disabled. Using stub.");
  return {
        pipelineData: [],
        sourceData: [],
        modeData: [],
        financials: {
            totalCost: 0,
            costPerHire: 0,
            avgDaysToHire: 0,
            activeVacancies: 0
        },
        decisionData: [],
        monthlyData: [],
        departmentGenderData: [],
        detailedStats: [],
        recentActivity: []
    };
}
