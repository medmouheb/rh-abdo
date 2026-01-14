"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in";

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
                    background: "#f3f4f6", // lighter gray
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
            {/* KPI Section */}
            <div className="rounded-xl border border-stroke bg-white p-6 shadow-card-2 dark:border-strokedark dark:bg-boxdark">
                <FadeIn>
                    <h4 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        Statistique des Postes Vacants
                    </h4>
                </FadeIn>

                <FadeInStagger className="flex flex-col gap-4" faster>
                    {/* Card 1 */}
                    <FadeIn>
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-center text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="absolute right-0 top-0 opacity-10">
                                <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 .82 1.87 2.62 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86 .45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4 .96-2.4 1.54 0 .9 .24 1.45 2.65 2 2.41 .56 4.2 1.59 4.2 3.57 0 1.97-1.41 3.3-3.12 3.51z" />
                                </svg>
                            </div>
                            <h5 className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-90">
                                Total Hiring Cost XoF
                            </h5>
                            <p className="text-2xl font-bold tracking-tight">4,700,000</p>
                        </div>
                    </FadeIn>

                    {/* Card 2 */}
                    <FadeIn>
                        <div className="group relative overflow-hidden rounded-xl bg-white border border-stroke p-4 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-boxdark dark:border-strokedark">
                            <h5 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Cost Per Hire XoF
                            </h5>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                4,700,000
                            </p>
                        </div>
                    </FadeIn>

                    {/* Card 3 */}
                    <FadeIn>
                        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 p-4 text-center text-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="absolute right-0 top-0 opacity-10">
                                <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                            </div>
                            <h5 className="mb-1 text-xs font-semibold uppercase tracking-wider opacity-90">
                                Avg. Days to Hire
                            </h5>
                            <p className="text-2xl font-bold tracking-tight">64.00</p>
                        </div>
                    </FadeIn>
                </FadeInStagger>

                {/* Vacant Active */}
                <FadeIn>
                    <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl bg-red-50 p-4 dark:bg-red-900/10 transition-transform hover:scale-105">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                            Postes Vacants Actifs
                        </h5>
                        <div className="animate-pulse flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                            <span className="text-2xl font-bold">1</span>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Radial Chart */}
            <FadeIn>
                <div className="flex flex-col items-center justify-between rounded-xl border border-stroke bg-white p-6 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark">
                    <h4 className="mb-2 text-center text-sm font-bold uppercase text-blue-600 dark:text-blue-400">
                        Taux de Recrutement
                    </h4>
                    <div className="relative">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartSeries}
                            type="radialBar"
                            height={220}
                        />
                    </div>
                    <p className="max-w-[150px] text-center text-xs text-gray-500">
                        Pourcentage de finalisation des recrutements
                    </p>
                </div>
            </FadeIn>
        </FadeInStagger>
    );
}
