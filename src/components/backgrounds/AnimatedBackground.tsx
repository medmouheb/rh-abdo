"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
    variant?: "gradient" | "particles" | "waves" | "mesh" | "dots" | "geometric";
    opacity?: number;
}

export default function AnimatedBackground({
    variant = "gradient",
    opacity = 0.15
}: AnimatedBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {variant === "gradient" && <GradientBackground opacity={opacity} />}
            {variant === "particles" && <ParticlesBackground opacity={opacity} />}
            {variant === "waves" && <WavesBackground opacity={opacity} />}
            {variant === "mesh" && <MeshBackground opacity={opacity} />}
            {variant === "dots" && <DotsBackground opacity={opacity} />}
            {variant === "geometric" && <GeometricBackground opacity={opacity} />}
        </div>
    );
}

// Animated Gradient Background
function GradientBackground({ opacity }: { opacity: number }) {
    return (
        <div className="absolute inset-0" style={{ opacity }}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
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
            <motion.div
                className="absolute inset-0 bg-gradient-to-tl from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-900"
                animate={{
                    backgroundPosition: ["100% 100%", "0% 0%", "100% 100%"],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundSize: "400% 400%",
                    mixBlendMode: "overlay",
                }}
            />
        </div>
    );
}

// Floating Particles Background
function ParticlesBackground({ opacity }: { opacity: number }) {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0" style={{ opacity }}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 dark:from-indigo-600 dark:to-purple-800"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

// Animated Waves Background
function WavesBackground({ opacity }: { opacity: number }) {
    return (
        <div className="absolute inset-0" style={{ opacity }}>
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                viewBox="0 0 1440 560"
            >
                <motion.path
                    d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,181.3C1248,181,1344,235,1392,261.3L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    fill="url(#gradient1)"
                    animate={{
                        d: [
                            "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,181.3C1248,181,1344,235,1392,261.3L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                            "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                            "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,181.3C1248,181,1344,235,1392,261.3L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                        ],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.path
                    d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,128C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    fill="url(#gradient2)"
                    animate={{
                        d: [
                            "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,128C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                            "M0,64L48,85.3C96,107,192,149,288,149.3C384,149,480,107,576,106.7C672,107,768,149,864,154.7C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                            "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,128C960,149,1056,203,1152,208C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// Mesh Gradient Background
function MeshBackground({ opacity }: { opacity: number }) {
    return (
        <div className="absolute inset-0" style={{ opacity }}>
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.3) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.3) 0px, transparent 50%)
                    `,
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}

// Animated Dots Pattern
function DotsBackground({ opacity }: { opacity: number }) {
    return (
        <div className="absolute inset-0" style={{ opacity }}>
            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.4) 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                }}
                animate={{
                    backgroundPosition: ["0px 0px", "30px 30px", "0px 0px"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
}

// Geometric Shapes Background
function GeometricBackground({ opacity }: { opacity: number }) {
    const shapes = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 200 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        duration: Math.random() * 30 + 20,
    }));

    return (
        <div className="absolute inset-0" style={{ opacity }}>
            {shapes.map((shape) => (
                <motion.div
                    key={shape.id}
                    className="absolute border-2 border-indigo-400/30 dark:border-indigo-600/30"
                    style={{
                        width: shape.size,
                        height: shape.size,
                        left: `${shape.x}%`,
                        top: `${shape.y}%`,
                        borderRadius: shape.id % 3 === 0 ? "50%" : shape.id % 2 === 0 ? "0%" : "20%",
                    }}
                    animate={{
                        rotate: [shape.rotation, shape.rotation + 360],
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
