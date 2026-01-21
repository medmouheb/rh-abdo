"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import {
    Users,
    Briefcase,
    TrendingUp,
    Shield,
    Zap,
    Target,
    Award,
    Rocket,
    Star,
    Sparkles
} from "lucide-react";

interface VideoBackgroundProps {
    variant?: "abstract" | "particles" | "gradient" | "video";
    overlay?: boolean;
    className?: string;
    videoSrc?: string;
}

export default function VideoBackground({
    variant = "abstract",
    overlay = true,
    className = "",
    videoSrc
}: VideoBackgroundProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const hasMounted = useHasMounted();

    // Fallback animated background if video fails to load
    const AnimatedFallback = () => (
        <div className="absolute inset-0">
            {/* Animated gradient mesh */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-blue-500/30"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundSize: "400% 400%",
                }}
            />

            {/* Floating orbs */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 blur-3xl"
                    style={{
                        width: `${150 + i * 40}px`,
                        height: `${150 + i * 40}px`,
                        left: `${10 + i * 12}%`,
                        top: `${5 + i * 11}%`,
                    }}
                    animate={{
                        x: [0, 80, -60, 0],
                        y: [0, -80, 60, 0],
                        scale: [1, 1.3, 0.9, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 12 + i * 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                    }}
                />
            ))}

            {/* Particle effect - Only render on client to avoid hydration mismatch due to Math.random() */}
            {hasMounted && [...Array(30)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-white/60 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );

    // Animated Icons Component
    const AnimatedIcons = () => {
        const icons = [
            { Icon: Users, delay: 0, x: "10%", y: "15%" },
            { Icon: Briefcase, delay: 0.5, x: "85%", y: "20%" },
            { Icon: TrendingUp, delay: 1, x: "15%", y: "75%" },
            { Icon: Shield, delay: 1.5, x: "80%", y: "70%" },
            { Icon: Zap, delay: 2, x: "50%", y: "10%" },
            { Icon: Target, delay: 2.5, x: "5%", y: "50%" },
            { Icon: Award, delay: 3, x: "95%", y: "60%" },
            { Icon: Rocket, delay: 3.5, x: "45%", y: "85%" },
            { Icon: Star, delay: 4, x: "70%", y: "30%" },
            { Icon: Sparkles, delay: 4.5, x: "25%", y: "45%" },
        ];

        return (
            <>
                {icons.map(({ Icon, delay, x, y }, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-white/20"
                        style={{ left: x, top: y }}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{
                            opacity: [0, 0.3, 0.2, 0.3, 0],
                            scale: [0, 1.2, 1, 1.2, 0],
                            rotate: [0, 180, 360],
                            y: [0, -30, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: delay,
                            ease: "easeInOut",
                        }}
                    >
                        <Icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
                    </motion.div>
                ))}
            </>
        );
    };

    return (
        <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
            {/* Video Background (if provided and no error) */}
            {variant === "video" && videoSrc && !videoError && (
                <motion.video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    onLoadedData={() => setIsLoaded(true)}
                    onError={() => setVideoError(true)}
                >
                    <source src={videoSrc} type="video/mp4" />
                </motion.video>
            )}

            {/* CSS-based animated background (always visible as fallback or primary) */}
            <AnimatedFallback />

            {/* Animated Icons Overlay */}
            <AnimatedIcons />

            {/* Overlay gradient for better text readability */}
            {overlay && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/40 via-primary/20 to-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            )}

            {/* Animated grid overlay */}
            <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(87, 80, 241, 0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(87, 80, 241, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                }}
                animate={{
                    backgroundPosition: ["0px 0px", "60px 60px"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Radial gradient spotlight effect */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(87, 80, 241, 0.2) 0%, transparent 70%)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
