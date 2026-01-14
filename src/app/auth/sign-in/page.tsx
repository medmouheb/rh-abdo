"use client";

import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import VideoBackground from "@/components/backgrounds/VideoBackground";

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

                    {/* Animated illustration */}
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
                    </motion.div>

                    {/* Feature badges */}
                    <motion.div
                      className="mt-12 flex flex-wrap gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.6 }}
                    >
                      {['🔒 Secure', '⚡ Fast', '🎯 Efficient'].map((badge, i) => (
                        <motion.div
                          key={badge}
                          className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 1.8 + i * 0.1 }}
                        >
                          {badge}
                        </motion.div>
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
