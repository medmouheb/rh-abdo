"use client";

import React from "react";

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="mb-8 flex w-full items-center justify-between px-4 sm:px-8">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <div key={index} className="flex flex-1 items-center">
                        {/* Step Circle & Label */}
                        <div className="relative flex flex-col items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted
                                        ? "border-primary bg-primary text-white"
                                        : isCurrent
                                            ? "border-primary bg-white text-primary dark:bg-boxdark"
                                            : "border-stroke bg-gray-2 text-gray-500 dark:border-strokedark dark:bg-meta-4"
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                )}
                            </div>
                            <span
                                className={`absolute -bottom-8 w-max text-xs font-semibold ${isCurrent ? "text-primary" : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                {step}
                            </span>
                        </div>

                        {/* Connector Line (not for last item) */}
                        {index < steps.length - 1 && (
                            <div className="mx-2 flex-1 h-1 w-full bg-stroke dark:bg-strokedark">
                                <div
                                    className={`h-full bg-primary transition-all duration-300 ${isCompleted ? "w-full" : "w-0"
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
