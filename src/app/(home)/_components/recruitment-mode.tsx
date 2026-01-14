"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function RecruitmentMode() {
    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            height: 350,
            fontFamily: 'Satoshi, sans-serif'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 6,
                borderRadiusApplication: "end"
            },
        },
        colors: ["#1e3a8a", "#7c3aed"],
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ["Externe", "Interne"],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    fontWeight: 600,
                    fontSize: '14px'
                }
            }
        },
        yaxis: {
            show: true,
            labels: {
                style: {
                    colors: "#94a3b8"
                }
            }
        },
        grid: {
            show: true,
            borderColor: "#f1f5f9",
            strokeDashArray: 4
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            theme: 'light'
        }
    };

    const series = [
        {
            name: "Candidats",
            data: [4, 3],
        },
    ];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white p-6 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-8 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Mode De Recrutement
                </h3>
                <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-primary hover:text-white dark:bg-meta-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-primary hover:text-white dark:bg-meta-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </button>
                </div>
            </div>
            <ReactApexChart options={options} series={series} type="bar" height={300} />
        </div>
    );
}
