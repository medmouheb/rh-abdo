"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function DelayCompliance() {
    const options: ApexOptions = {
        chart: {
            type: "pie",
            fontFamily: 'Satoshi, sans-serif'
        },
        labels: ["Respect", "Retard"],
        colors: ["#8B4513", "#fbbf24"],
        dataLabels: {
            enabled: true,
            formatter: function (val: number, opts) {
                if (opts.seriesIndex === 0) return "94%";
                return "";
            },
            style: {
                fontSize: '24px',
                fontWeight: 'bold',
                colors: ['#fff']
            },
            dropShadow: { enabled: true, blur: 3, opacity: 0.5 }
        },
        legend: { show: true, position: 'bottom' },
        stroke: { show: true, colors: ['#fff'], width: 2 },
        tooltip: { theme: 'light' }
    };

    const series = [94, 6];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white p-6 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark xl:col-span-3">
            <div className="mb-4 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Délais De Recrutement
                </h3>
                <span className="text-xs text-gray-500">Taux de respect</span>
            </div>

            <ReactApexChart options={options} series={series} type="pie" height={320} />
        </div>
    );
}
