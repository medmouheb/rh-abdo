"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in";
import { motion } from "framer-motion";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function VacancyStats() {
    const chartOptions: ApexOptions = {
        chart: {
            type: "radialBar",
            sparkline: {
                enabled: true,
            },
            height: 180,
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#f3f4f6",
                    strokeWidth: "90%",
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        offsetY: -10,
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#10B981",
                    },
                },
            },
        },
        fill: {
            colors: ["#10B981"],
        },
        labels: ["Rate"],
    };

    const chartSeries = [14];

    return (
        <FadeInStagger className="flex flex-col gap-6" faster>
            {/* Main Container */}
            <motion.div
                className="rounded-2xl border border-stroke/50 bg-white/80 backdrop-blur-sm p-6 shadow-2xl dark:border-dark-3/50 dark:bg-gray-dark/80"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
            >
                <FadeIn>
                    <h4 className="mb-6 text-center text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Statistique des Postes Vacants
                    </h4>
                </FadeIn>

                <FadeInStagger className="flex flex-col gap-4" faster>
                    {/* Card 1 - Total Hiring Cost */}
                    <FadeIn>
                        <motion.div
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-5 text-center text-white shadow-xl"
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Animated background gradient */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Icon */}
                            <div className="absolute right-2 top-2 opacity-10">
                                <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 .82 1.87 2.62 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86 .45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4 .96-2.4 1.54 0 .9 .24 1.45 2.65 2 2.41 .56 4.2 1.59 4.2 3.57 0 1.97-1.41 3.3-3.12 3.51z" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-90">
                                    💰 Total Hiring Cost XoF
                                </h5>
                                <p className="text-3xl font-bold tracking-tight">4,700,000</p>
                            </div>
                        </motion.div>
                    </FadeIn>

                    {/* Card 2 - Cost Per Hire */}
                    <FadeIn>
                        <motion.div
                            className="group relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm border-2 border-primary/20 p-5 text-center shadow-lg dark:bg-gray-dark/90 dark:border-primary/30"
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                                animate={{
                                    x: ["-100%", "100%"],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                            />

                            <div className="relative z-10">
                                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                                    📊 Cost Per Hire XoF
                                </h5>
                                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    4,700,000
                                </p>
                            </div>
                        </motion.div>
                    </FadeIn>

                    {/* Card 3 - Avg Days to Hire */}
                    <FadeIn>
                        <motion.div
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-center text-white shadow-xl"
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Animated background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5,
                                }}
                            />

                            {/* Icon */}
                            <div className="absolute right-2 top-2 opacity-10">
                                <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-90">
                                    ⏱️ Avg. Days to Hire
                                </h5>
                                <p className="text-3xl font-bold tracking-tight">64.00</p>
                            </div>
                        </motion.div>
                    </FadeIn>
                </FadeInStagger>

                {/* Vacant Active */}
                <FadeIn>
                    <motion.div
                        className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-5 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/50 dark:border-red-800/50"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h5 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                            🔴 Postes Vacants Actifs
                        </h5>
                        <motion.div
                            className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg"
                            animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                    "0 0 0 0 rgba(239, 68, 68, 0.4)",
                                    "0 0 0 10px rgba(239, 68, 68, 0)",
                                    "0 0 0 0 rgba(239, 68, 68, 0)"
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <span className="text-2xl font-bold">1</span>
                        </motion.div>
                    </motion.div>
                </FadeIn>
            </motion.div>

            {/* Radial Chart */}
            <FadeIn>
                <motion.div
                    className="flex flex-col items-center justify-between rounded-2xl border border-stroke/50 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-2xl dark:border-dark-3/50 dark:from-gray-dark dark:to-blue-900/10 backdrop-blur-sm"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.3 }}
                >
                    <h4 className="mb-3 text-center text-sm font-bold uppercase bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        📈 Taux de Recrutement
                    </h4>
                    <div className="relative">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartSeries}
                            type="radialBar"
                            height={220}
                        />
                    </div>
                    <p className="max-w-[150px] text-center text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Pourcentage de finalisation des recrutements
                    </p>
                </motion.div>
            </FadeIn>
        </FadeInStagger>
    );
}
