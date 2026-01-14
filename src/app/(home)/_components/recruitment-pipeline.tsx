"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function RecruitmentPipeline() {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            fontFamily: "Satoshi, sans-serif",
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                barHeight: "65%",
                distributed: true,
                dataLabels: {
                    position: "top", // bottom used to be standard, top puts label inside right
                },
            },

        },
        colors: [
            "#1e293b", // Slate 800
            "#1e40af", // Blue 800
            "#7c3aed", // Violet 600
            "#dc2626", // Red 600
            "#f59e0b", // Amber 500
            "#3b82f6", // Blue 500
            "#06b6d4", // Cyan 500
            "#84cc16", // Lime 500
            "#10b981", // Emerald 500
        ],
        dataLabels: {
            enabled: true,
            textAnchor: "start",
            style: {
                colors: ["#fff"],
                fontSize: "12px",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 600
            },
            formatter: function (val, opt) {
                return val + "";
            },
            offsetX: 0,
            dropShadow: {
                enabled: true,
                blur: 1,
                color: '#000',
                opacity: 0.45
            }
        },
        xaxis: {
            categories: [
                "Validation fiche",
                "Redaction & Diffusion",
                "Collecte candidatures",
                "Validation shortlist",
                "Entretiens 1er tour",
                "Entretiens 2nd tour",
                "Selection candidats",
                "Visite médicale",
                "Offre d'emploi",
            ],
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    colors: ["#64748b"], // Slate 500
                    fontFamily: "Satoshi, sans-serif"
                },
                maxWidth: 180
            }
        },
        grid: { show: false },
        legend: { show: false },
        tooltip: {
            enabled: true,
            theme: "light",
            style: {
                fontSize: '12px',
                fontFamily: "Satoshi, sans-serif"
            }
        },
    };

    const series = [
        {
            name: "Candidates",
            data: [4, 4, 4, 4, 4, 4, 2, 2, 2],
        },
    ];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-6 flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
                <h3 className="text-sm font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Pipeline De Recrutement
                </h3>
                <div className="rounded bg-violet-50 p-1 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
            </div>

            <div className="-ml-2">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={320}
                />
            </div>
        </div>
    );
}
