"use client";

import { useState } from "react";
import { VacantPosition } from "@/app/actions/vacant-positions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from "framer-motion";

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
    const itemsPerPage = 5;

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

    return (
        <motion.div
            className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
            <motion.div
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h3
                    className="font-semibold text-dark dark:text-white text-2xl"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, x: 10 }}
                >
                    📋 Vacant Positions
                </motion.h3>
                <motion.div
                    className="flex gap-2"
                    variants={itemVariants}
                >
                    <motion.button
                        onClick={handleExportExcel}
                        className="inline-flex items-center justify-center rounded-[5px] bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        whileTap={{ scale: 0.9, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        📊 Export Excel
                    </motion.button>
                    <Link href="/vacant-positions/create">
                        <motion.span
                            className="inline-flex items-center justify-center rounded-[5px] bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 shadow-lg"
                            whileHover={{ scale: 1.1, rotate: -2 }}
                            whileTap={{ scale: 0.9, rotate: 2 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            ➕ Add Position
                        </motion.span>
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                className="mb-4 flex flex-col gap-4 md:flex-row"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <motion.input
                    type="text"
                    placeholder="🔍 Search by ID, Title, Dept..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-dark-3 dark:bg-dark-2 transition-all focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page
                    }}
                    whileFocus={{ scale: 1.02, borderColor: "#5750F1" }}
                />
                <motion.select
                    className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-dark-3 dark:bg-dark-2 md:w-48 transition-all focus:ring-2 focus:ring-primary"
                    value={filterDepartment}
                    onChange={(e) => {
                        setFilterDepartment(e.target.value);
                        setCurrentPage(1);
                    }}
                    whileFocus={{ scale: 1.02 }}
                >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </motion.select>
                <motion.select
                    className="w-full rounded-md border border-gray-300 px-4 py-2 dark:border-dark-3 dark:bg-dark-2 md:w-48 transition-all focus:ring-2 focus:ring-primary"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                    }}
                    whileFocus={{ scale: 1.02 }}
                >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </motion.select>
            </motion.div>

            <motion.div
                className="max-w-full overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <table className="w-full table-auto">
                    <motion.thead
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <tr className="bg-gradient-to-r from-primary/10 to-primary/5 text-left dark:bg-dark-2">
                            <th className="min-w-[50px] px-4 py-4 font-medium text-dark dark:text-white">ID</th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Department</th>
                            <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">Job Title</th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Recruiter</th>
                            <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">Candidates</th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Source</th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">Date</th>
                            <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">Status</th>
                            <th className="px-4 py-4 font-medium text-dark dark:text-white">Actions</th>
                        </tr>
                    </motion.thead>
                    <AnimatePresence mode="wait">
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    className="border-b border-stroke dark:border-dark-3 transition-colors cursor-pointer"
                                    initial={{ opacity: 0, x: -50, rotateX: -10 }}
                                    animate={{ opacity: 1, x: 0, rotateX: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{
                                        delay: index * 0.08,
                                        duration: 0.4,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        backgroundColor: "rgba(87, 80, 241, 0.05)",
                                        scale: 1.002,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <motion.td
                                        className="px-4 py-4 dark:text-white font-semibold"
                                        whileHover={{ scale: 1.1, color: "#5750F1" }}
                                    >
                                        #{item.id}
                                    </motion.td>
                                    <td className="px-4 py-4 dark:text-white">{item.service}</td>
                                    <motion.td
                                        className="px-4 py-4 dark:text-white font-medium"
                                        whileHover={{ x: 5 }}
                                    >
                                        {item.jobTitle}
                                    </motion.td>
                                    <td className="px-4 py-4 dark:text-white">
                                        {item.recruiter?.username || "Unassigned"}
                                    </td>
                                    <td className="px-4 py-4 dark:text-white">
                                        <motion.div
                                            className="flex items-center gap-2"
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            <motion.span
                                                className="inline-flex items-center justify-center rounded-full bg-primary/20 px-3 py-1 text-sm font-bold text-primary"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatType: "reverse"
                                                }}
                                            >
                                                {item.candidates.length}
                                            </motion.span>
                                        </motion.div>
                                    </td>
                                    <td className="px-4 py-4 dark:text-white">{item.recruitmentSource || "-"}</td>
                                    <td className="px-4 py-4 dark:text-white text-sm">
                                        {format(new Date(item.createdAt), "MMM dd, yyyy")}
                                    </td>
                                    <td className="px-4 py-4">
                                        <motion.span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${item.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                : item.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                }`}
                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {item.status}
                                        </motion.span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/vacant-positions/${item.id}`}>
                                                <motion.span
                                                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary cursor-pointer font-medium text-sm"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    👁️ View
                                                </motion.span>
                                            </Link>
                                            <Link href={`/vacant-positions/edit/${item.id}`}>
                                                <motion.span
                                                    className="text-primary hover:underline cursor-pointer font-medium text-sm"
                                                    whileHover={{ scale: 1.1, x: 2 }}
                                                >
                                                    ✏️ Edit
                                                </motion.span>
                                            </Link>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </AnimatePresence>
                </table>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                                }`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}


            {filteredData.length === 0 && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.p
                        className="text-gray-500 dark:text-gray-400 text-lg"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        No positions found 🔍
                    </motion.p>
                </motion.div>
            )}
        </motion.div>
    );
}
