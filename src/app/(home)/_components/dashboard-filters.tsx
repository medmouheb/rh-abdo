"use client";

import React from "react";

export function DashboardFilters() {
    return (
        <div className="mb-6 flex flex-col gap-6 rounded-xl border border-stroke bg-white p-5 shadow-card-2 dark:border-strokedark dark:bg-boxdark md:flex-row md:items-end md:justify-between transition-all hover:shadow-card-3">
            {/* Date Range Group */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Start Month & Year
                    </label>
                    <input
                        type="month"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        End Month & Year
                    </label>
                    <input
                        type="month"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                </div>
            </div>

            {/* Selectors Group */}
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Recruiter
                    </label>
                    <div className="relative">
                        <select className="appearance-none w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm font-medium text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                            <option value="">Select Recruiter</option>
                            <option value="1">John Doe</option>
                            <option value="2">Jane Smith</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <svg
                            className="h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        Department
                    </label>
                    <div className="relative">
                        <select className="appearance-none w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-10 text-sm font-medium text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                            <option value="">All Departments</option>
                            <option value="hr">Human Resources</option>
                            <option value="it">Technology</option>
                            <option value="sales">Sales</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Job ID
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Job ID..."
                        className="w-full min-w-[200px] rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pl-10 text-sm font-medium text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}
