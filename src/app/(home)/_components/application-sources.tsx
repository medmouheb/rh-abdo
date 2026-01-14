"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export function ApplicationSources() {
    const options: ApexOptions = {
        chart: {
            type: "donut",
            fontFamily: 'Satoshi, sans-serif'
        },
        colors: ["#ef4444", "#0ea5e9"], // Red-500, Sky-500
        labels: ["Site officiel", "LinkedIn"],
        legend: {
            show: true,
            position: "bottom",
            itemMargin: {
                horizontal: 10,
                vertical: 5
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: "#64748b"
                        },
                        value: {
                            show: true,
                            fontSize: '28px',
                            fontWeight: 700,
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: "Total",
                            fontSize: '14px',
                            fontWeight: 600,
                            color: "#64748b"
                        }
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            colors: ['#fff'],
            width: 2
        },
        tooltip: {
            theme: 'light'
        }
    };

    const series = [67, 33];

    return (
        <div className="col-span-12 rounded-xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-card-2 transition-all hover:shadow-card-3 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div className="mb-4 text-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Sources De Demande
                </h3>
                <span className="text-xs font-medium text-slate-400">Répartition par canal</span>
            </div>
            <div className="flex justify-center pb-4">
                <ReactApexChart
                    options={options}
                    series={series}
                    type="donut"
                    height={320}
                />
            </div>
        </div>
    );
}
