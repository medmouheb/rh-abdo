"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

// Types
interface BaseProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

// 1. Page & Layout Animations
export const PageAnimationWrapper = ({ children, className }: BaseProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const FadeIn = ({ children, delay = 0, duration = 0.5, className }: BaseProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({ children, direction = "up", delay = 0, className }: BaseProps & { direction?: "up" | "down" | "left" | "right" }) => {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
            x: direction === "left" ? 20 : direction === "right" ? -20 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration: 0.5, delay, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// 2. Component Animations
export const CardAnimation = ({ children, delay = 0, className }: BaseProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

// 3. List & Stagger Animations
export const StaggerContainer = ({ children, className, delay = 0 }: BaseProps) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    delayChildren: delay,
                    staggerChildren: 0.1
                }
            }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, className }: BaseProps) => (
    <motion.div
        variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                }
            }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

// 4. Interactive Elements
export const ScaleButton = ({ children, onClick, className, disabled }: BaseProps & { onClick?: () => void, disabled?: boolean }) => (
    <motion.button
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={onClick}
        className={className}
        disabled={disabled}
    >
        {children}
    </motion.button>
);

export const PulseBadge = ({ children, className }: BaseProps) => (
    <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
    >
        <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="relative">{children}</span>
    </motion.div>
);
