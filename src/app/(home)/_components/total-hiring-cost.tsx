"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface CostStats {
    totalCostTND: number;
    totalCostXOF: number;
    averageCostTND: number;
    hiringCount: number;
    monthlyTrend: number;
}

// Taux de change TND vers XOF (Franc CFA)
const TND_TO_XOF_RATE = 215; // 1 TND ≈ 215 XOF (à ajuster selon le taux actuel)

export function TotalHiringCost() {
    const [stats, setStats] = useState<CostStats>({
        totalCostTND: 0,
        totalCostXOF: 0,
        averageCostTND: 0,
        hiringCount: 0,
        monthlyTrend: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/vacant-positions');
            if (response.ok) {
                const positions = await response.json();

                // Calculate total hiring cost
                let totalCostTND = 0;
                let hiringCount = 0;

                positions.forEach((position: any) => {
                    if (position.hiringCost) {
                        totalCostTND += position.hiringCost;
                        hiringCount++;
                    }
                });

                const totalCostXOF = totalCostTND * TND_TO_XOF_RATE;
                const averageCostTND = hiringCount > 0 ? totalCostTND / hiringCount : 0;

                // Calculate monthly trend (mock data - you can implement real calculation)
                const monthlyTrend = Math.random() * 20 - 10; // Random between -10 and +10

                setStats({
                    totalCostTND,
                    totalCostXOF,
                    averageCostTND,
                    hiringCount,
                    monthlyTrend
                });
            }
        } catch (error) {
            console.error("Failed to fetch cost stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const formatCurrency = (num: number, currency: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    };

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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white">
                            Coût Total d'Embauche
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {stats.hiringCount} recrutements
                        </p>
                    </div>
                </div>
                {stats.monthlyTrend !== 0 && (
                    <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${stats.monthlyTrend > 0
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                        {stats.monthlyTrend > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-semibold">
                            {Math.abs(stats.monthlyTrend).toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Main Cost Display - TND */}
                    <motion.div
                        className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6 dark:from-primary/20 dark:to-primary/10"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-center">
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                💰 Coût Total (TND)
                            </p>
                            <motion.p
                                className="text-4xl font-bold text-primary"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                            >
                                {formatNumber(stats.totalCostTND)} TND
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Cost in XOF */}
                    <motion.div
                        className="rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-6 dark:from-green-900/30 dark:to-green-900/10"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="text-center">
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                🌍 Coût Total (XOF)
                            </p>
                            <motion.p
                                className="text-3xl font-bold text-green-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.4 }}
                            >
                                {formatNumber(stats.totalCostXOF)} XOF
                            </motion.p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Taux: 1 TND = {TND_TO_XOF_RATE} XOF
                            </p>
                        </div>
                    </motion.div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                                Coût Moyen
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                                {formatNumber(stats.averageCostTND)}
                            </p>
                            <p className="text-xs text-gray-500">TND / recrutement</p>
                        </motion.div>

                        <motion.div
                            className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                                Recrutements
                            </p>
                            <p className="text-xl font-bold text-purple-600">
                                {stats.hiringCount}
                            </p>
                            <p className="text-xs text-gray-500">postes pourvus</p>
                        </motion.div>
                    </div>

                    {/* Conversion Info */}
                    <motion.div
                        className="rounded-lg border-2 border-dashed border-gray-300 p-4 dark:border-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                💱 Conversion automatique
                            </span>
                            <span className="font-semibold text-dark dark:text-white">
                                TND → XOF
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
