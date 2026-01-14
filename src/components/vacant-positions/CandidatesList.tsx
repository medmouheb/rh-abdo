"use client";

import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: Date;
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

const rowVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export default function CandidatesList({ candidates, hiringRequestId }: { candidates: Candidate[], hiringRequestId: number }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(candidates.length / itemsPerPage);
    const paginatedCandidates = candidates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <motion.div
            className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card mt-6"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <motion.div
                className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-dark-3 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <motion.h3
                    className="font-semibold text-dark dark:text-white text-xl"
                    whileHover={{ scale: 1.05, x: 10 }}
                >
                    👥 Candidates ({candidates.length})
                </motion.h3>
                <Link href={`/candidates/create?hiringRequestId=${hiringRequestId}`}>
                    <motion.span
                        className="inline-flex items-center justify-center rounded-[5px] bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        whileTap={{ scale: 0.9, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        ➕ Add Candidate
                    </motion.span>
                </Link>
            </motion.div>
            <div className="p-6.5">
                {candidates.length === 0 ? (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.p
                            className="text-gray-500 dark:text-gray-400 text-lg"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            No candidates applied yet 🔍
                        </motion.p>
                    </motion.div>
                ) : (
                    <>
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <motion.thead
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <tr className="bg-gradient-to-r from-primary/10 to-primary/5 text-left dark:bg-dark-2">
                                        <th className="px-4 py-4 font-medium text-dark dark:text-white">Name</th>
                                        <th className="px-4 py-4 font-medium text-dark dark:text-white">Email</th>
                                        <th className="px-4 py-4 font-medium text-dark dark:text-white">Date Applied</th>
                                        <th className="px-4 py-4 font-medium text-dark dark:text-white">Status</th>
                                        <th className="px-4 py-4 font-medium text-dark dark:text-white">Action</th>
                                    </tr>
                                </motion.thead>
                                <AnimatePresence mode="wait">
                                    <motion.tbody
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        key={currentPage}
                                    >
                                        {paginatedCandidates.map((candidate, index) => (
                                            <motion.tr
                                                key={candidate.id}
                                                className="border-b border-stroke dark:border-dark-3 cursor-pointer"
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit={{ opacity: 0, x: 50 }}
                                                whileHover={{
                                                    backgroundColor: "rgba(87, 80, 241, 0.1)",
                                                    scale: 1.01,
                                                    boxShadow: "0 4px 12px rgba(87, 80, 241, 0.15)"
                                                }}
                                                transition={{ delay: index * 0.08 }}
                                            >
                                                <motion.td
                                                    className="px-4 py-4 dark:text-white font-medium"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    {candidate.firstName} {candidate.lastName}
                                                </motion.td>
                                                <td className="px-4 py-4 dark:text-white">{candidate.email}</td>
                                                <td className="px-4 py-4 dark:text-white text-sm">
                                                    {format(new Date(candidate.createdAt), "MMM dd, yyyy")}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <motion.span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${candidate.status === "HIRED"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                            : candidate.status === "REJECTED"
                                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                            }`}
                                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        {candidate.status}
                                                    </motion.span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Link href={`/candidates/${candidate.id}`}>
                                                        <motion.span
                                                            className="text-primary hover:underline cursor-pointer font-medium"
                                                            whileHover={{ scale: 1.2, x: 10, color: "#3730a3" }}
                                                            whileTap={{ scale: 0.9 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            👁️ View
                                                        </motion.span>
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </AnimatePresence>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, candidates.length)}</span> of <span className="font-medium">{candidates.length}</span> results
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
                    </>
                )}
            </div>
        </motion.div>
    );
}
