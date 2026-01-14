
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import CandidatesList from "@/components/vacant-positions/CandidatesList";

export const metadata = {
    title: "Vacant Position Details | NextAdmin HR",
    description: "View details of a vacant job position",
};

export default async function VacantPositionDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const hiringRequestId = parseInt(id);
    const position = await prisma.hiringRequest.findUnique({
        where: { id: hiringRequestId },
        include: {
            recruiter: true,
            candidates: true
        },
    });

    if (!position) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Position Not Found 😕</h2>
                <Link href="/vacant-positions" className="text-primary hover:underline mt-4 inline-block">
                    Return to list
                </Link>
            </div>
        )
    }

    return (
        <>
            <Breadcrumb pageName="Position Details" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    {/* <!-- Job Details Card --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                📋 Job Information
                            </h3>
                        </div>
                        <div className="p-6.5 flex flex-col gap-4">
                            <div className="col-span-1">
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Job Title
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.jobTitle}</p>
                            </div>

                            <div className="col-span-1">
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Department
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.service}</p>
                            </div>

                            <div className="col-span-1">
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Personnel Type
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.personnelType}</p>
                            </div>

                            <div className="col-span-1">
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Contract Type
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.contractType}</p>
                            </div>

                            <div className="col-span-1">
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Work Location
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.workLocation}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-9">
                    {/* <!-- Recruitment Details Card --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                🎯 Recruitment Details
                            </h3>
                        </div>
                        <div className="p-6.5 flex flex-col gap-4">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Status
                                </label>
                                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${position.status === 'HIRED' ? 'bg-success/10 text-success' :
                                    position.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
                                        'bg-warning/10 text-warning'
                                    }`}>
                                    {position.status}
                                </span>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Recruiter
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.recruiter?.username || "Not Assigned"}</p>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Start Date
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {position.requestDate ? format(new Date(position.requestDate), 'MMM dd, yyyy') : 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Reason
                                </label>
                                <p className="text-gray-600 dark:text-gray-300">{position.reason}</p>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Justification
                                </label>
                                <p className="text-gray-600 dark:text-gray-300 italic">{position.justification}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-4">
                <Link
                    href={`/vacant-positions/edit/${position.id}`}
                    className="flex items-center justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                >
                    Edit Position
                </Link>
                <Link
                    href="/vacant-positions"
                    className="flex items-center justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                    Back to List
                </Link>
            </div>

            <div className="mt-8">
                <CandidatesList candidates={position.candidates} hiringRequestId={position.id} />
            </div>
        </>
    );
}
