
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VacantPositionForm from "@/components/vacant-positions/VacantPositionForm";
import VacantPositionManager from "@/components/vacant-positions/VacantPositionManager";
import { getVacantPositions, getRecruiters } from "@/app/actions/vacant-positions";
import { prisma } from "@/lib/db";

export const metadata = {
    title: "Edit Vacant Position | NextAdmin HR",
    description: "Edit an existing vacant job position",
};

import CandidatesList from "@/components/vacant-positions/CandidatesList";

export default async function EditVacantPositionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const hiringRequestId = parseInt(id);

    // Fetch the position with all related data
    const position = await prisma.hiringRequest.findUnique({
        where: { id: hiringRequestId },
        include: {
            recruiter: {
                select: {
                    id: true,
                    username: true,
                    role: true,
                }
            },
            candidates: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    status: true,
                    createdAt: true,
                }
            }
        },
    });

    // Fetch all available candidates
    const allCandidates = await prisma.candidate.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Fetch all recruiters
    const { data: recruiters } = await getRecruiters();

    if (!position) {
        return (
            <>
                <Breadcrumb pageName="Edit Vacant Position" />
                <div className="rounded-lg border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-400">Position not found</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Breadcrumb pageName="Gestion du Poste Vacant" />
            <div className="flex flex-col gap-6">
                {/* Position Manager - Main Component */}
                <VacantPositionManager
                    positionId={position.id}
                    initialData={{
                        jobTitle: position.jobTitle,
                        service: position.service,
                        workLocation: position.workLocation || undefined,
                        contractType: position.contractType,
                        status: position.status,
                        budget: position.hiringCost || 0,
                        recruiter: position.recruiter || undefined,
                        candidates: position.candidates.map((c: any) => ({
                            ...c,
                            appliedAt: c.createdAt.toISOString(),
                        })),
                    }}
                    availableCandidates={allCandidates.map((c: any) => ({
                        ...c,
                        appliedAt: c.createdAt.toISOString(),
                    }))}
                    availableRecruiters={recruiters || []}
                />

                {/* Original Form - For editing other details */}
                <VacantPositionForm
                    recruiters={recruiters || []}
                    initialData={position}
                    isEdit={true}
                />
            </div>
        </>
    );
}
