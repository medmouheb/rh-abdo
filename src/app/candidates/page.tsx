"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCandidates, getCandidateStatistics } from "@/app/actions/candidates";
import type { CandidateWithRelations } from "@/app/actions/candidates";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

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

    const filteredCandidates = candidates.filter((candidate) => {
        const matchesSearch =
            candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.positionAppliedFor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus ? candidate.status === filterStatus : true;
        const matchesDepartment = filterDepartment ? candidate.department === filterDepartment : true;
        const matchesSource = filterSource ? candidate.source === filterSource : true;

        return matchesSearch && matchesStatus && matchesDepartment && matchesSource;
    });

    const uniqueDepartments = Array.from(new Set(candidates.map(c => c.department).filter(Boolean)));
    const uniqueSources = Array.from(new Set(candidates.map(c => c.source).filter(Boolean)));

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName="Gestion des Candidats" />

            {/* Statistics Cards */}
            {statistics && (
                <motion.div
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Candidats</p>
                                <h3 className="text-3xl font-bold text-primary">{statistics.total}</h3>
                            </div>
                            <div className="text-4xl">👥</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">En Cours</p>
                                <h3 className="text-3xl font-bold text-yellow-600">{statistics.inInterview}</h3>
                            </div>
                            <div className="text-4xl">⏳</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Embauchés</p>
                                <h3 className="text-3xl font-bold text-green-600">{statistics.hired}</h3>
                            </div>
                            <div className="text-4xl">✅</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Taux de Conversion</p>
                                <h3 className="text-3xl font-bold text-blue-600">{statistics.conversionRate}%</h3>
                            </div>
                            <div className="text-4xl">📊</div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Actions Bar */}
            <motion.div
                className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-dark dark:text-white">
                    📋 Liste des Candidats
                </h2>
                <div className="flex gap-2">
                    <motion.button
                        onClick={handleExportExcel}
                        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-center font-medium text-white shadow-lg hover:bg-green-700"
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        📊 Export Excel
                    </motion.button>
                    <Link href="/candidates/create">
                        <motion.span
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-center font-medium text-white shadow-lg hover:bg-opacity-90"
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ➕ Nouveau Candidat
                        </motion.span>
                    </Link>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                className="mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <motion.input
                        type="text"
                        placeholder="🔍 Rechercher..."
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.select
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="">Tous les statuts</option>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </motion.select>
                    <motion.select
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="">Tous les départements</option>
                        {uniqueDepartments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </motion.select>
                    <motion.select
                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                        value={filterSource}
                        onChange={(e) => setFilterSource(e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                    >
                        <option value="">Toutes les sources</option>
                        {uniqueSources.map((source) => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </motion.select>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                className="rounded-lg bg-white shadow-lg dark:bg-gray-dark overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <motion.thead
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
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
                        </motion.thead>
                        <AnimatePresence>
                            <tbody>
                                {filteredCandidates.length === 0 ? (
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
                                    filteredCandidates.map((candidate, index) => (
                                        <motion.tr
                                            key={candidate.id}
                                            className="border-b border-stroke dark:border-dark-3"
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                            whileHover={{
                                                backgroundColor: "rgba(87, 80, 241, 0.05)",
                                                scale: 1.01
                                            }}
                                        >
                                            <motion.td
                                                className="px-4 py-4 font-semibold dark:text-white"
                                                whileHover={{ scale: 1.1, color: "#5750F1" }}
                                            >
                                                #{candidate.id}
                                            </motion.td>
                                            <td className="px-4 py-4">
                                                <motion.div whileHover={{ x: 5 }}>
                                                    <p className="font-medium text-dark dark:text-white">
                                                        {candidate.firstName} {candidate.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{candidate.email}</p>
                                                </motion.div>
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
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    {STATUS_LABELS[candidate.status as keyof typeof STATUS_LABELS]}
                                                </motion.span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Link href={`/candidates/${candidate.id}`}>
                                                    <motion.span
                                                        className="text-primary hover:underline cursor-pointer font-medium"
                                                        whileHover={{ scale: 1.2, x: 10 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        👁️ Voir
                                                    </motion.span>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </AnimatePresence>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
