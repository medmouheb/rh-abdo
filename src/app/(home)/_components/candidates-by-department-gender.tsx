"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";

interface CandidateStats {
    byDepartment: { [key: string]: number };
    byGender: { male: number; female: number };
    total: number;
}

export function CandidatesByDepartmentGender() {
    const [stats, setStats] = useState<CandidateStats>({
        byDepartment: {},
        byGender: { male: 0, female: 0 },
        total: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/candidates');
            if (response.ok) {
                const result = await response.json();
                const candidates = result.data || [];

                // Calculate stats
                const byDepartment: { [key: string]: number } = {};
                let male = 0;
                let female = 0;

                candidates.forEach((candidate: any) => {
                    // Count by department
                    const dept = candidate.department || 'Non spécifié';
                    byDepartment[dept] = (byDepartment[dept] || 0) + 1;

                    // Count by gender
                    if (candidate.gender === 'MALE') male++;
                    else if (candidate.gender === 'FEMALE') female++;
                });

                setStats({
                    byDepartment,
                    byGender: { male, female },
                    total: candidates.length
                });
            }
        } catch (error) {
            console.error("Failed to fetch candidate stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const topDepartments = Object.entries(stats.byDepartment)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const malePercentage = stats.total > 0 ? (stats.byGender.male / stats.total) * 100 : 0;
    const femalePercentage = stats.total > 0 ? (stats.byGender.female / stats.total) * 100 : 0;

    return (
        <motion.div
            className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-gray-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white">
                            Candidats par Département & Genre
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Répartition des {stats.total} candidats
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Gender Distribution */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">
                            Répartition par Genre
                        </h4>
                        <div className="space-y-3">
                            {/* Male */}
                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        👨 Hommes
                                    </span>
                                    <span className="text-sm font-bold text-primary">
                                        {stats.byGender.male} ({malePercentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <motion.div
                                        className="h-2 rounded-full bg-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${malePercentage}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                </div>
                            </div>

                            {/* Female */}
                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        👩 Femmes
                                    </span>
                                    <span className="text-sm font-bold text-pink-600">
                                        {stats.byGender.female} ({femalePercentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <motion.div
                                        className="h-2 rounded-full bg-pink-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${femalePercentage}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Departments */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-dark dark:text-white">
                            Top 5 Départements
                        </h4>
                        <div className="space-y-2">
                            {topDepartments.map(([dept, count], index) => {
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                const colors = [
                                    'bg-purple-500',
                                    'bg-blue-500',
                                    'bg-green-500',
                                    'bg-yellow-500',
                                    'bg-orange-500'
                                ];

                                return (
                                    <motion.div
                                        key={dept}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                    >
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                🏢 {dept}
                                            </span>
                                            <span className="text-sm font-bold text-dark dark:text-white">
                                                {count} ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                            <motion.div
                                                className={`h-2 rounded-full ${colors[index]}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{stats.total}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Candidats</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {Object.keys(stats.byDepartment).length}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Départements</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
