"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCandidates, getCandidateStatistics } from "@/app/actions/candidates";
import type { CandidateWithRelations } from "@/app/actions/candidates";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import {
    PageAnimationWrapper,
    CardAnimation,
    StaggerContainer,
    StaggerItem,
    ScaleButton,
    FadeIn,
    SlideIn
} from "@/components/animations/PageAnimations";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

const STATUS_COLORS = {
    RECEIVED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    TECHNICAL_INTERVIEW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    HR_INTERVIEW: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    SELECTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    MEDICAL_VISIT: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    OFFER_SENT: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    HIRED: "bg-green-600 text-white",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_LABELS = {
    RECEIVED: "📥 Reçu",
    SHORTLISTED: "⭐ Présélectionné",
    TECHNICAL_INTERVIEW: "🔧 Entretien Technique",
    HR_INTERVIEW: "💼 Entretien RH",
    SELECTED: "✅ Sélectionné",
    MEDICAL_VISIT: "🏥 Visite Médicale",
    OFFER_SENT: "📄 Offre Envoyée",
    HIRED: "🎉 Embauché",
    REJECTED: "❌ Refusé",
};

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<CandidateWithRelations[]>([]);
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("");
    const [filterSource, setFilterSource] = useState("");
    const [filterWorkSite, setFilterWorkSite] = useState("");
    const [filterEducation, setFilterEducation] = useState("");
    const [filterMinExp, setFilterMinExp] = useState("");
    const [filterMaxSalary, setFilterMaxSalary] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            const [candidatesResult, statsResult] = await Promise.all([
                getCandidates(),
                getCandidateStatistics(),
            ]);

            if (candidatesResult.success) {
                setCandidates(candidatesResult.data || []);
            }

            if (statsResult.success) {
                setStatistics(statsResult.data);
            }

            setLoading(false);
        }
        fetchData();
    }, []);

    const uniqueDepartments = Array.from(new Set(candidates.map(c => c.department).filter(Boolean)));
    const uniqueSources = Array.from(new Set(candidates.map(c => c.source).filter(Boolean)));
    const uniqueWorkSites = Array.from(new Set(candidates.map(c => c.workSite).filter(Boolean)));
    const uniqueEducationLevels = Array.from(new Set(candidates.map(c => c.educationLevel).filter(Boolean)));


    const filteredCandidates = candidates.filter((candidate) => {
        const matchesSearch =
            candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.positionAppliedFor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus ? candidate.status === filterStatus : true;
        const matchesDepartment = filterDepartment ? candidate.department === filterDepartment : true;
        const matchesSource = filterSource ? candidate.source === filterSource : true;
        const matchesWorkSite = filterWorkSite ? candidate.workSite === filterWorkSite : true;
        const matchesEducation = filterEducation ? candidate.educationLevel === filterEducation : true;
        const matchesMinExp = filterMinExp ? (candidate.yearsOfExperience || 0) >= parseInt(filterMinExp) : true;
        const matchesMaxSalary = filterMaxSalary ? (candidate.salaryExpectation || 0) <= parseInt(filterMaxSalary) : true;

        return matchesSearch && matchesStatus && matchesDepartment && matchesSource && matchesWorkSite && matchesEducation && matchesMinExp && matchesMaxSalary;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
    const paginatedCandidates = filteredCandidates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus, filterDepartment, filterSource, filterWorkSite, filterEducation, filterMinExp, filterMaxSalary]);

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredCandidates.map(c => ({
            "ID": c.id,
            "Nom": `${c.firstName} ${c.lastName}`,
            "Email": c.email,
            "Téléphone": c.phone || "-",
            "Poste": c.positionAppliedFor,
            "Département": c.department || "-",
            "Source": c.source || "-",
            "Expérience": c.yearsOfExperience ? `${c.yearsOfExperience} ans` : "-",
            "Statut": c.status,
            "Date de candidature": format(new Date(c.createdAt), "dd/MM/yyyy"),
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Candidats");
        XLSX.writeFile(wb, "candidats.xlsx");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    return (
        <>
            <AnimatedBackground variant="mesh" />
            <PageAnimationWrapper>
                <Breadcrumb pageName="Gestion des Candidats" />

                {/* Statistics Cards */}
                {statistics && (
                    <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6" delay={0.1}>
                        <StaggerItem>
                            <CardAnimation className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark h-full">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Candidats</p>
                                        <h3 className="text-3xl font-bold text-primary">{statistics.total}</h3>
                                    </div>
                                    <div className="text-4xl">👥</div>
                                </div>
                            </CardAnimation>
                        </StaggerItem>

                        <StaggerItem>
                            <CardAnimation className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark h-full">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">En Cours</p>
                                        <h3 className="text-3xl font-bold text-yellow-600">{statistics.inInterview}</h3>
                                    </div>
                                    <div className="text-4xl">⏳</div>
                                </div>
                            </CardAnimation>
                        </StaggerItem>

                        <StaggerItem>
                            <CardAnimation className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark h-full">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Embauchés</p>
                                        <h3 className="text-3xl font-bold text-green-600">{statistics.hired}</h3>
                                    </div>
                                    <div className="text-4xl">✅</div>
                                </div>
                            </CardAnimation>
                        </StaggerItem>

                        <StaggerItem>
                            <CardAnimation className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark h-full">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Taux de Conversion</p>
                                        <h3 className="text-3xl font-bold text-blue-600">{statistics.conversionRate}%</h3>
                                    </div>
                                    <div className="text-4xl">📊</div>
                                </div>
                            </CardAnimation>
                        </StaggerItem>
                    </StaggerContainer>
                )}

                {/* Actions Bar */}
                <SlideIn direction="left" delay={0.2} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold text-dark dark:text-white">
                        📋 Liste des Candidats
                    </h2>
                    <div className="flex gap-2">
                        <ScaleButton
                            onClick={handleExportExcel}
                            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-center font-medium text-white shadow-lg hover:bg-green-700"
                        >
                            📊 Export Excel
                        </ScaleButton>
                        <Link href="/candidates/create">
                            <ScaleButton
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-center font-medium text-white shadow-lg hover:bg-opacity-90"
                            >
                                ➕ Nouveau Candidat
                            </ScaleButton>
                        </Link>
                    </div>
                </SlideIn>

                {/* Filters */}
                <FadeIn delay={0.3} className="mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6 mb-4">
                        <input
                            type="text"
                            placeholder="🔍 Rechercher..."
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 md:col-span-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">Tous les statuts</option>
                            {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        <select
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                        >
                            <option value="">Département</option>
                            {uniqueDepartments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <select
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                            value={filterWorkSite}
                            onChange={(e) => setFilterWorkSite(e.target.value)}
                        >
                            <option value="">Site</option>
                            {uniqueWorkSites.map((site) => (
                                <option key={site} value={site}>{site}</option>
                            ))}
                        </select>

                        <select
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                            value={filterEducation}
                            onChange={(e) => setFilterEducation(e.target.value)}
                        >
                            <option value="">Niveau d'étude</option>
                            {uniqueEducationLevels.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <input
                            type="number"
                            placeholder="Années Exp Min"
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                            value={filterMinExp}
                            onChange={(e) => setFilterMinExp(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Salaire Max Attendue"
                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                            value={filterMaxSalary}
                            onChange={(e) => setFilterMaxSalary(e.target.value)}
                        />
                    </div>
                </FadeIn>

                {/* Table */}
                <SlideIn direction="up" delay={0.4} className="rounded-lg bg-white shadow-lg dark:bg-gray-dark overflow-hidden">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gradient-to-r from-primary/10 to-primary/5 text-left dark:bg-dark-2">
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">ID</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Candidat</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Poste</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Département</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Source</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Date</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Statut</th>
                                    <th className="px-4 py-4 font-medium text-dark dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <AnimatePresence mode="wait">
                                <tbody key={currentPage}>
                                    {paginatedCandidates.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center">
                                                <motion.p
                                                    className="text-gray-500 dark:text-gray-400 text-lg"
                                                    animate={{ y: [0, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    Aucun candidat trouvé 🔍
                                                </motion.p>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedCandidates.map((candidate, index) => (
                                            <motion.tr
                                                key={candidate.id}
                                                className="border-b border-stroke dark:border-dark-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                    duration: 0.3,
                                                    ease: "easeOut"
                                                }}
                                                whileHover={{
                                                    backgroundColor: "rgba(87, 80, 241, 0.05)",
                                                    scale: 1.005,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <td className="px-4 py-4 font-semibold dark:text-white">
                                                    #{candidate.id}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="font-medium text-dark dark:text-white">
                                                            {candidate.firstName} {candidate.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{candidate.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 dark:text-white">{candidate.positionAppliedFor}</td>
                                                <td className="px-4 py-4 dark:text-white">{candidate.department || "-"}</td>
                                                <td className="px-4 py-4 dark:text-white">{candidate.source || "-"}</td>
                                                <td className="px-4 py-4 dark:text-white text-sm">
                                                    {format(new Date(candidate.createdAt), "dd/MM/yyyy")}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <motion.span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[candidate.status as keyof typeof STATUS_COLORS]
                                                            }`}
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 400 }}
                                                    >
                                                        {STATUS_LABELS[candidate.status as keyof typeof STATUS_LABELS]}
                                                    </motion.span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Link href={`/candidates/${candidate.id}`}>
                                                        <ScaleButton className="text-primary hover:underline font-medium">
                                                            👁️ Voir
                                                        </ScaleButton>
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </AnimatePresence>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <motion.div
                            className="flex justify-between items-center px-6 py-4 border-t border-stroke dark:border-dark-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Affichage <span className="font-medium text-dark dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium text-dark dark:text-white">{Math.min(currentPage * itemsPerPage, filteredCandidates.length)}</span> sur <span className="font-medium text-dark dark:text-white">{filteredCandidates.length}</span> résultats
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                        : "bg-white text-gray-700 hover:bg-primary hover:text-white border border-stroke dark:bg-gray-800 dark:text-white dark:border-dark-3 dark:hover:bg-primary shadow-sm"
                                        }`}
                                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                                >
                                    ← Précédent
                                </motion.button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <motion.button
                                                key={pageNum}
                                                onClick={() => paginate(pageNum)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
                                                    ? "bg-primary text-white shadow-lg"
                                                    : "bg-white text-gray-700 hover:bg-gray-100 border border-stroke dark:bg-gray-800 dark:text-white dark:border-dark-3 dark:hover:bg-gray-700"
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {pageNum}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <motion.button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                        : "bg-white text-gray-700 hover:bg-primary hover:text-white border border-stroke dark:bg-gray-800 dark:text-white dark:border-dark-3 dark:hover:bg-primary shadow-sm"
                                        }`}
                                    whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                                >
                                    Suivant →
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </SlideIn>
            </PageAnimationWrapper>
        </>
    );
}
