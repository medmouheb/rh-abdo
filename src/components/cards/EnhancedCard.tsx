"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EnhancedCardProps {
    children: ReactNode;
    variant?: "default" | "gradient" | "glass" | "bordered" | "elevated";
    className?: string;
    hover?: boolean;
    gradient?: "primary" | "purple" | "blue" | "green" | "orange";
}

export default function EnhancedCard({
    children,
    variant = "default",
    className = "",
    hover = true,
    gradient = "primary"
}: EnhancedCardProps) {

    const gradients = {
        primary: "from-primary/10 via-purple-500/5 to-blue-500/10",
        purple: "from-purple-500/10 via-pink-500/5 to-purple-500/10",
        blue: "from-blue-500/10 via-cyan-500/5 to-blue-500/10",
        green: "from-green-500/10 via-emerald-500/5 to-green-500/10",
        orange: "from-orange-500/10 via-red-500/5 to-orange-500/10",
    };

    const variants = {
        default: `
            rounded-xl bg-white shadow-lg 
            dark:bg-gray-dark dark:shadow-card
            border border-stroke/50 dark:border-dark-3/50
        `,
        gradient: `
            rounded-xl bg-gradient-to-br ${gradients[gradient]}
            backdrop-blur-sm shadow-xl
            border border-white/20 dark:border-white/10
            relative overflow-hidden
        `,
        glass: `
            rounded-xl bg-white/80 backdrop-blur-xl shadow-2xl
            dark:bg-gray-dark/80
            border border-white/30 dark:border-white/10
        `,
        bordered: `
            rounded-xl bg-white shadow-md
            dark:bg-gray-dark
            border-2 border-primary/20 dark:border-primary/30
        `,
        elevated: `
            rounded-xl bg-white shadow-2xl
            dark:bg-gray-dark dark:shadow-card
            border border-stroke/30 dark:border-dark-3/30
        `
    };

    const hoverEffects = hover ? {
        whileHover: {
            y: -4,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.3, ease: "easeOut" }
        }
    } : {};

    return (
        <motion.div
            className={`${variants[variant]} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            {...hoverEffects}
        >
            {variant === "gradient" && (
                <>
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: "easeInOut",
                        }}
                    />
                </>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradient?: "primary" | "purple" | "blue" | "green" | "orange";
}

export function StatCard({ title, value, icon, trend, gradient = "primary" }: StatCardProps) {
    const gradients = {
        primary: "from-primary to-purple-600",
        purple: "from-purple-500 to-pink-600",
        blue: "from-blue-500 to-cyan-600",
        green: "from-green-500 to-emerald-600",
        orange: "from-orange-500 to-red-600",
    };

    return (
        <EnhancedCard variant="glass" hover={true}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[gradient]} shadow-lg`}>
                        <div className="text-white text-2xl">
                            {icon}
                        </div>
                    </div>
                    {trend && (
                        <motion.div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${trend.isPositive
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                        </motion.div>
                    )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {title}
                </h3>
                <motion.p
                    className="text-3xl font-bold text-dark dark:text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    {value}
                </motion.p>
            </div>
        </EnhancedCard>
    );
}

// Info Card Component
interface InfoCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    icon?: ReactNode;
    variant?: "default" | "gradient" | "glass";
}

export function InfoCard({ title, description, children, icon, variant = "default" }: InfoCardProps) {
    return (
        <EnhancedCard variant={variant} hover={true}>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    {icon && (
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-dark dark:text-white">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </EnhancedCard>
    );
}
