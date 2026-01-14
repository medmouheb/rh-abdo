"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function ApplicationsTrend() {
    const options: ApexOptions = {
        chart: {
            type: "area",
            height: 350,
            zoom: { enabled: false },
            toolbar: { show: false },
            fontFamily: 'Satoshi, sans-serif'
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        colors: ["#3b82f6"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            show: true,
            labels: {
                style: { colors: "#9ca3af" }
            }
        },
        grid: {
            show: true,
            borderColor: "#f3f4f6",
            strokeDashArray: 4
        },
        tooltip: { theme: 'light' }
    };

    const series = [
        {
            name: "Demandes",
            data: [0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
        },
    ];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white p-6 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark xl:col-span-5">
            <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
                        Demandes d'emploi
                    </h3>
                    <p className="text-xs text-gray-500">Volumétrie mensuelle</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-red-500">Année:</span>
                    <select className="rounded border border-stroke bg-gray-50 px-2 py-1 text-xs outline-none dark:border-strokedark dark:bg-meta-4">
                        <option>2026</option>
                        <option>2025</option>
                    </select>
                </div>
            </div>

            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={320}
            />
        </div>
    );
}
