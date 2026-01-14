"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageAnimationWrapperProps {
    children: ReactNode;
}

export const PageAnimationWrapper = ({ children }: PageAnimationWrapperProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
            {children}
        </motion.div>
    );
};

export const CardAnimation = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children }: { children: ReactNode }) => {
    return (
        <motion.div
            variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                        type: "spring",
                        stiffness: 100
                    }
                }
            }}
        >
            {children}
        </motion.div>
    );
};
