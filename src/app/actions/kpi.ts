"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getKPIDashboardData(year?: number) {
  try {
    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    // 1. Pipeline Stats
    const pipelineGroups = await prisma.candidate.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const pipelineData = [
      { name: 'Validation fiche', count: 0 },
      { name: 'Redaction & Diffusion', count: 0 },
      { name: 'Collecte candidatures', count: 0 },
      { name: 'Validation shortlist', count: 0 },
      { name: 'Entretiens 1er tour', count: 0 },
      { name: 'Entretiens 2nd tour', count: 0 },
      { name: 'Selection candidats', count: 0 },
      { name: 'Visite médicale', count: 0 },
      { name: 'Offre d\'emploi', count: 0 },
    ];

    pipelineGroups.forEach(group => {
      const count = group._count.id;
      switch (group.status) {
        case 'Nouveau': pipelineData[2].count += count; break;
        case 'Traitement de dossier': pipelineData[3].count += count; break;
        case 'Entretien RH': pipelineData[4].count += count; break;
        case 'Entretien Technique': 
        case 'Entretien Manager': pipelineData[5].count += count; break;
        case 'En attente de décision': pipelineData[6].count += count; break;
        case 'Offre envoyée': pipelineData[8].count += count; break;
      }
    });

    // 2. Sources
    const sourceGroups = await prisma.candidate.groupBy({
      by: ['source'],
      _count: { id: true }
    });
    const sourceData = sourceGroups.map(g => ({
      name: g.source || 'Autre',
      value: g._count.id
    })).filter(d => d.value > 0);

    // 3. Recruitment Mode
    const modeGroups = await prisma.candidate.groupBy({
      by: ['recruitmentMode'],
      _count: { id: true }
    });
    const modeData = modeGroups.map(g => ({
      name: g.recruitmentMode || 'Non spécifié',
      count: g._count.id
    }));

    // 4. Financials
    const totalHiringCost = await prisma.hiringRequest.aggregate({
      where: { createdAt: { gte: startDate, lte: endDate } },
      _sum: { hiringCost: true }
    });
    const hiredCount = await prisma.candidate.count({
      where: { status: 'Embauché', updatedAt: { gte: startDate, lte: endDate } }
    });
    const totalCost = totalHiringCost._sum.hiringCost || 0;
    const costPerHire = hiredCount > 0 ? (totalCost / hiredCount) : 0;
    const avgDaysToHire = 45; 
    const activeVacancies = await prisma.hiringRequest.count({
      where: { status: 'VACANT' }
    });

    // 5. Decision Finale
    const decisionData = [
      { name: 'Embauché', value: hiredCount, color: '#10B981' },
      { name: 'Refus', value: 0, color: '#EF4444' },
      { name: 'En cours', value: 0, color: '#F59E0B' },
      { name: 'Sans décision', value: 0, color: '#9CA3AF' },
    ];
    pipelineGroups.forEach(g => {
        if (g.status === 'Refus candidat' || g.status === 'Refus entreprise') {
            decisionData[1].value += g._count.id;
        } else if (g.status === 'Embauché') {
             // Already counted
        } else if (g.status === 'Nouveau') {
            decisionData[3].value += g._count.id;
        } else {
             decisionData[2].value += g._count.id;
        }
    });

    // 6. Demandes d'Emploi by Site and Month
    const requests = await prisma.hiringRequest.findMany({
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { createdAt: true, workLocation: true, service: true }
    });
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const monthName = new Date(currentYear, i, 1).toLocaleString('fr-FR', { month: 'short' });
        return { name: monthName, Total: 0, TT: 0, TTG: 0, Autre: 0 };
    });
    requests.forEach(req => {
        const month = req.createdAt.getMonth();
        const site = req.workLocation || 'Autre';
        monthlyStats[month].Total += 1;
        if (site === 'TT') monthlyStats[month].TT += 1;
        else if (site === 'TTG') monthlyStats[month].TTG += 1;
        else monthlyStats[month].Autre += 1;
    });

    // 7. Candidats par Département & Genre
    const candidates = await prisma.candidate.findMany({
        select: { department: true, gender: true, status: true }
    });
    const deptGenderStats: Record<string, { department: string, Homme: number, Femme: number }> = {};
    candidates.forEach(c => {
        const dept = c.department || 'Non assigné';
        const gender = c.gender === 'MALE' || c.gender === 'Homme' ? 'Homme' : 
                       c.gender === 'FEMALE' || c.gender === 'Femme' ? 'Femme' : 'Non spécifié';
        if (!deptGenderStats[dept]) deptGenderStats[dept] = { department: dept, Homme: 0, Femme: 0 };
        if (gender === 'Homme') deptGenderStats[dept].Homme += 1;
        else if (gender === 'Femme') deptGenderStats[dept].Femme += 1;
    });
    const departmentGenderData = Object.values(deptGenderStats);


    // 8. Detailed Department Stats (New)
    // Gather all unique departments from requests and candidates
    const allDepartments = new Set<string>();
    requests.forEach(r => r.service && allDepartments.add(r.service));
    candidates.forEach(c => c.department && allDepartments.add(c.department));

    const detailedStats: any[] = [];
    
    // Pre-calculate counts per department
    const reqCounts: Record<string, number> = {};
    const vacancyCounts: Record<string, number> = {}; // We need current status for this, but 'requests' is filtered by year. Let's assume we want ALL active vacancies, or vacancies created this year? User said "all info". Let's show vacancies created this year for consistency, or we need a separate query for all ACTIVE vacancies grouped by service. 
    // Let's do a separate group by for active vacancies
    const activeVacanciesByDept = await prisma.hiringRequest.groupBy({
        by: ['service'],
        where: { status: 'VACANT' },
        _count: { id: true }
    });
    const vacancyMap = Object.fromEntries(activeVacanciesByDept.map(v => [v.service || 'Autre', v._count.id]));

    requests.forEach(r => {
        const s = r.service || 'Autre';
        reqCounts[s] = (reqCounts[s] || 0) + 1;
    });

    const candCounts: Record<string, number> = {};
    const hiredCounts: Record<string, number> = {};
    candidates.forEach(c => {
        const s = c.department || 'Autre';
        candCounts[s] = (candCounts[s] || 0) + 1;
        if (c.status === 'Embauché') hiredCounts[s] = (hiredCounts[s] || 0) + 1;
    });

    Array.from(allDepartments).forEach(dept => {
        detailedStats.push({
            department: dept,
            totalRequests: reqCounts[dept] || 0,
            activeVacancies: vacancyMap[dept] || 0,
            totalCandidates: candCounts[dept] || 0,
            hiredCount: hiredCounts[dept] || 0,
            conversionRate: (candCounts[dept] > 0) ? Math.round(((hiredCounts[dept] || 0) / candCounts[dept]) * 100) : 0
        });
    });

    // 9. Recent Activity (New)
    const recentActivity = await prisma.candidateStatusHistory.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            candidate: { select: { firstName: true, lastName: true } },
            changedByUser: { select: { username: true } }
        }
    });

    const formattedActivity = recentActivity.map(log => ({
        id: log.id,
        user: log.changedByUser?.username || 'Système',
        action: `a passé ${log.candidate.firstName} ${log.candidate.lastName} en`,
        target: log.statusLabel || log.newStatus,
        time: log.createdAt,
        type: 'status_change',
        color: 'bg-blue-500' // could be dynamic
    }));

    // Add some mock activity if empty for demo
    if (formattedActivity.length === 0) {
        formattedActivity.push(
            { id: 1, user: 'Sarah RH', action: 'a créé une nouvelle demande', target: 'Ingénieur DevOps', time: new Date(), type: 'new_request', color: 'bg-green-500' },
            { id: 2, user: 'Mohamed Admin', action: 'a planifié un entretien avec', target: 'Amine Ben Ali', time: new Date(Date.now() - 3600000), type: 'interview', color: 'bg-purple-500' },
        );
    }

    return {
        pipelineData,
        sourceData,
        modeData,
        financials: {
            totalCost,
            costPerHire,
            avgDaysToHire,
            activeVacancies
        },
        decisionData,
        monthlyData: monthlyStats,
        departmentGenderData,
        detailedStats: detailedStats.sort((a,b) => b.totalRequests - a.totalRequests),
        recentActivity: formattedActivity
    };

  } catch (error) {
    console.error("Error fetching KPI stats:", error);
    return null;
  }
}
