
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import VacantPositionForm from "@/components/vacant-positions/VacantPositionForm";
import { getVacantPositions, getRecruiters } from "@/app/actions/vacant-positions";
import { prisma } from "@/lib/db";

export const metadata = {
    title: "Edit Vacant Position | NextAdmin HR",
    description: "Edit an existing vacant job position",
};

import CandidatesList from "@/components/vacant-positions/CandidatesList";

export default async function EditVacantPositionPage({ params }: { params: { id: string } }) {
    const hiringRequestId = parseInt(params.id);
    const position = await prisma.hiringRequest.findUnique({
        where: { id: hiringRequestId },
        include: {
            recruiter: true,
            candidates: true
        },
    });

    const { data: recruiters } = await getRecruiters();

    if (!position) {
        return (
            <>
                <div>Position not found</div>
            </>
        )
    }

    return (
        <>
            <Breadcrumb pageName="Edit Vacant Position" />
            <div className="flex flex-col gap-10">
                <VacantPositionForm
                    recruiters={recruiters || []}
                    initialData={position}
                    isEdit={true}
                />
                <CandidatesList candidates={position.candidates} hiringRequestId={position.id} />
            </div>
        </>
    );
}
