"use client";

import { useState } from "react";
import { VacantPosition } from "@/app/actions/vacant-positions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    Download, Plus, Search, Filter, Users, Briefcase, Calendar,
    Eye, Edit, TrendingUp, Sparkles
} from "lucide-react";

interface VacantPositionsTableProps {
    initialData: VacantPosition[];
    recruiters: any[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export default function VacantPositionsTable({ initialData, recruiters }: VacantPositionsTableProps) {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().includes(searchTerm);
        const matchesDepartment = filterDepartment ? item.service === filterDepartment : true;
        const matchesStatus = filterStatus ? item.status === filterStatus : true;
        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const uniqueDepartments = Array.from(new Set(data.map((item) => item.service)));
    const uniqueStatuses = Array.from(new Set(data.map((item) => item.status)));

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData.map(item => ({
            "Job ID": item.id,
            "Department": item.service,
            "Job Title": item.jobTitle,
            "Recruiter": item.recruiter?.username || "N/A",
            "Candidates Count": item.candidates.length,
            "Source": item.recruitmentSource || "-",
            "Created At": format(new Date(item.createdAt), "yyyy-MM-dd"),
            "Status": item.status,
            "Comments": item.comments || "-"
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vacant Positions");
        XLSX.writeFile(wb, "vacant_positions.xlsx");
    };

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <motion.div
            className="rounded-2xl border border-slate-200/60 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
            {/* Premium Header with Gradient */}
            <motion.div
                className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 p-8 text-white overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10 dark:opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                className="p-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Briefcase className="w-6 h-6" />
                            </motion.div>
                            <h2 className="text-3xl font-bold tracking-tight">Postes Vacants</h2>
                        </div>
                        <p className="text-indigo-100 dark:text-indigo-200 text-sm">Gérez et suivez toutes les positions ouvertes</p>
                    </motion.div>

                    <motion.div
                        className="flex gap-3"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-all font-semibold shadow-lg"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Exporter</span>
                        </motion.button>
                        <Link href="/vacant-positions/create">
                            <motion.span
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 dark:bg-white dark:text-indigo-700 rounded-xl hover:shadow-xl transition-all font-semibold shadow-lg"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Nouveau Poste</span>
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {[
                        { label: "Total", value: data.length, icon: Briefcase },
                        { label: "Actifs", value: filteredData.length, icon: TrendingUp },
                        { label: "Candidats", value: data.reduce((sum, p) => sum + p.candidates.length, 0), icon: Users },
                        { label: "Départements", value: uniqueDepartments.length, icon: Sparkles },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 dark:border-white/5"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                        >
                            <div className="flex items-center gap-3">
                                <stat.icon className="w-5 h-5 text-white/90" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-white/80">{stat.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Filters Section */}
            <motion.div
                className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200 dark:border-slate-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                            <motion.input
                                type="text"
                                placeholder="Rechercher par ID, titre, département..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                whileFocus={{ scale: 1.01 }}
                            />
                        </div>
                    </div>
                    <motion.select
                        className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                        value={filterDepartment}
                        onChange={(e) => {
                            setFilterDepartment(e.target.value);
                            setCurrentPage(1);
                        }}
                        whileFocus={{ scale: 1.01 }}
                    >
                        <option value="">Tous les départements</option>
                        {uniqueDepartments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </motion.select>
                    <motion.select
                        className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        whileFocus={{ scale: 1.01 }}
                    >
                        <option value="">Tous les statuts</option>
                        {uniqueStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </motion.select>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                className="overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <table className="w-full">
                    <motion.thead
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 border-b-2 border-indigo-200 dark:border-indigo-800"
                    >
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Département</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Titre du Poste</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden lg:table-cell">Recruteur</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Candidats</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden xl:table-cell">Source</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider hidden md:table-cell">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Actions</th>
                        </tr>
                    </motion.thead>
                    <AnimatePresence mode="wait">
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {paginatedData.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors bg-white dark:bg-slate-900"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{
                                        delay: index * 0.05,
                                        duration: 0.3
                                    }}
                                    whileHover={{ scale: 1.001, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <motion.span
                                            className="text-sm font-bold text-indigo-600 dark:text-indigo-400"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            #{item.id}
                                        </motion.span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200 font-medium">
                                        {item.service}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold">
                                        {item.jobTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden lg:table-cell">
                                        {item.recruiter?.username || "Non assigné"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <motion.span
                                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                                            whileHover={{ scale: 1.2 }}
                                            animate={{
                                                scale: [1, 1.05, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                        >
                                            {item.candidates.length}
                                        </motion.span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden xl:table-cell">
                                        {item.recruitmentSource || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden md:table-cell">
                                        {format(new Date(item.createdAt), "dd/MM/yyyy")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <motion.span
                                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${item.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                                : item.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                    : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                                }`}
                                            whileHover={{ scale: 1.1, rotate: 2 }}
                                        >
                                            {item.status}
                                        </motion.span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/vacant-positions/${item.id}`}>
                                                <motion.button
                                                    className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Voir"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                            <Link href={`/vacant-positions/edit/${item.id}`}>
                                                <motion.button
                                                    className="p-2 text-slate-600 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </AnimatePresence>
                </table>
            </motion.div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-t border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                        Affichage de <span className="font-bold text-indigo-600 dark:text-indigo-400">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> sur{" "}
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredData.length}</span> résultats
                    </div>

                    <div className="flex items-center gap-2">
                        {/* First Page */}
                        <motion.button
                            onClick={() => paginate(1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg transition-all ${currentPage === 1
                                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                : "text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                }`}
                            whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                            whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                        >
                            <ChevronsLeft className="w-5 h-5" />
                        </motion.button>

                        {/* Previous */}
                        <motion.button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                                : "bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-indigo-900/30"
                                }`}
                            whileHover={currentPage !== 1 ? { scale: 1.05, y: -2 } : {}}
                            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400 dark:text-slate-500">...</span>
                                ) : (
                                    <motion.button
                                        key={page}
                                        onClick={() => paginate(page as number)}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === page
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                            : "bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-indigo-900/30"
                                            }`}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {page}
                                    </motion.button>
                                )
                            ))}
                        </div>

                        {/* Next */}
                        <motion.button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                                : "bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-indigo-900/30"
                                }`}
                            whileHover={currentPage !== totalPages ? { scale: 1.05, y: -2 } : {}}
                            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>

                        {/* Last Page */}
                        <motion.button
                            onClick={() => paginate(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg transition-all ${currentPage === totalPages
                                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                : "text-slate-700 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                }`}
                            whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                            whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
                        >
                            <ChevronsRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {filteredData.length === 0 && (
                <motion.div
                    className="text-center py-16 px-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Search className="w-20 h-20 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    </motion.div>
                    <p className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Aucun poste trouvé
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Essayez de modifier vos critères de recherche
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}