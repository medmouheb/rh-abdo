"use client";

import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import VideoBackground from "@/components/backgrounds/VideoBackground";
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
  Sparkles,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

export default function SignIn() {
  return (
    <>
      <VideoBackground variant="abstract" overlay={true} />

      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-gray-dark/95 dark:shadow-card overflow-hidden border border-white/20">
            <div className="flex flex-wrap items-stretch min-h-[600px]">
              {/* Left Side - Login Form */}
              <motion.div
                className="w-full xl:w-1/2 flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="w-full p-8 sm:p-12 xl:p-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Signin />
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Side - Animated Welcome Section */}
              <motion.div
                className="hidden w-full xl:flex xl:w-1/2 bg-gradient-to-br from-primary via-purple-600 to-blue-600 relative overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Animated background elements */}
                <div className="absolute inset-0">
                  {/* Floating circles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                      style={{
                        width: `${100 + i * 50}px`,
                        height: `${100 + i * 50}px`,
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 12}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link className="mb-8 inline-block" href="/">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={"/images/logo/logo.svg"}
                          alt="Logo"
                          width={176}
                          height={32}
                          className="brightness-0 invert"
                        />
                      </motion.div>
                    </Link>

                    <motion.p
                      className="mb-4 text-xl font-medium text-white/90"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      Sign in to your account
                    </motion.p>

                    <motion.h1
                      className="mb-6 text-4xl font-bold text-white sm:text-5xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      Welcome Back!
                    </motion.h1>

                    <motion.p
                      className="mb-12 max-w-md text-lg text-white/80 leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      Please sign in to your account by completing the necessary
                      fields to access your HR dashboard
                    </motion.p>

                    {/* Animated illustration with icons */}
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 1.4 }}
                    >
                      <motion.div
                        animate={{
                          y: [0, -20, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src={"/images/grids/grid-02.svg"}
                          alt="Illustration"
                          width={405}
                          height={325}
                          className="mx-auto opacity-80"
                        />
                      </motion.div>
                      
                      {/* Floating animated icons */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                      >
                        {/* Center icon cluster */}
                        <motion.div
                          className="relative w-64 h-64"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          {[
                            { Icon: Users, angle: 0, size: 24 },
                            { Icon: Briefcase, angle: 40, size: 28 },
                            { Icon: TrendingUp, angle: 80, size: 26 },
                            { Icon: Shield, angle: 120, size: 24 },
                            { Icon: Zap, angle: 160, size: 30 },
                            { Icon: Target, angle: 200, size: 26 },
                            { Icon: Award, angle: 240, size: 24 },
                            { Icon: Rocket, angle: 280, size: 28 },
                          ].map(({ Icon, angle, size }, i) => {
                            const radian = (angle * Math.PI) / 180;
                            const radius = 100;
                            const x = Math.cos(radian) * radius;
                            const y = Math.sin(radian) * radius;
                            
                            return (
                              <motion.div
                                key={i}
                                className="absolute text-white/40"
                                style={{
                                  left: `calc(50% + ${x}px)`,
                                  top: `calc(50% + ${y}px)`,
                                  transform: "translate(-50%, -50%)",
                                }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.4, 0.7, 0.4],
                                  rotate: [0, 360],
                                }}
                                transition={{
                                  duration: 3 + i * 0.3,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                  ease: "easeInOut",
                                }}
                              >
                                <Icon size={size} strokeWidth={1.5} />
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Feature badges with icons */}
                    <motion.div
                      className="mt-12 flex flex-wrap gap-3 justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.6 }}
                    >
                      {[
                        { icon: Shield, text: 'Secure', color: 'from-green-400 to-emerald-500' },
                        { icon: Zap, text: 'Fast', color: 'from-yellow-400 to-orange-500' },
                        { icon: Target, text: 'Efficient', color: 'from-blue-400 to-cyan-500' },
                        { icon: BarChart3, text: 'Analytics', color: 'from-purple-400 to-pink-500' },
                      ].map(({ icon: Icon, text, color }, i) => (
                        <motion.div
                          key={text}
                          className={`px-4 py-2 rounded-full bg-gradient-to-r ${color} backdrop-blur-sm text-sm font-medium text-white shadow-lg flex items-center gap-2`}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 5,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: 0
                          }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 1.8 + i * 0.15,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 10] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: i * 0.3,
                              ease: "easeInOut"
                            }}
                          >
                            <Icon size={16} />
                          </motion.div>
                          <span>{text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Additional floating elements */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      {/* Sparkle effects */}
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={`sparkle-${i}`}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Decorative corner elements */}
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Footer text */}
          <motion.p
            className="mt-6 text-center text-sm text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            © 2026 NextAdmin HR. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
