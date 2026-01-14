"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function FinalDecision() {
    const options: ApexOptions = {
        chart: {
            type: "pie",
            fontFamily: 'Satoshi, sans-serif'
        },
        colors: ["#9ca3af", "#fbbf24", "#22c55e", "#ef4444", "#374151"],
        labels: [
            "No decision",
            "En cours",
            "Embauché",
            "Refus du candidat",
            "Non embauché",
        ],
        legend: {
            position: "bottom",
            fontSize: '12px',
            markers: { radius: 12 } as any,
            itemMargin: { horizontal: 5, vertical: 5 }
        },
        dataLabels: {
            enabled: true,
            dropShadow: { enabled: false },
            style: {
                fontSize: '14px',
                fontWeight: 600,
            }
        },
        stroke: {
            show: true,
            colors: ['#fff'],
            width: 1
        },
        tooltip: { theme: 'light' }
    };

    const series = [0, 2, 1, 1, 0];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white p-6 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-4 border-b border-stroke pb-4 dark:border-strokedark">
                <h3 className="text-center text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                    Decision Finale
                </h3>
            </div>

            <ReactApexChart options={options} series={series} type="pie" height={310} />
        </div>
    );
}
