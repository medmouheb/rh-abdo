"use client";

import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 dark:from-primary/20 dark:via-purple-900/10 dark:to-blue-900/10">
      <div className="w-full max-w-6xl">
        <div className="rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-gray-dark/95 dark:shadow-card overflow-hidden border border-stroke dark:border-dark-3">
          <div className="flex flex-wrap items-stretch min-h-[600px]">
            {/* Left Side - Login Form */}
            <div className="w-full xl:w-1/2 flex items-center">
              <div className="w-full p-8 sm:p-12 xl:p-16">
                <Signin />
              </div>
            </div>

            {/* Right Side - Welcome Section */}
            <div className="hidden w-full xl:flex xl:w-1/2 bg-gradient-to-br from-primary via-purple-600 to-blue-600 relative overflow-hidden">
              {/* Simple gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-primary/20 to-black/40"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                <Link className="mb-8 inline-block" href="/">
                  <Image
                    src={"/images/logo/logo.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                    className="brightness-0 invert"
                  />
                </Link>

                <p className="mb-4 text-xl font-medium text-white/90">
                  Sign in to your account
                </p>

                <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                  Welcome Back!
                </h1>

                <p className="mb-12 max-w-md text-lg text-white/80 leading-relaxed">
                  Please sign in to your account by completing the necessary
                  fields to access your HR dashboard
                </p>

                {/* Simple illustration */}
                <div className="relative">
                  <Image
                    src={"/images/grids/grid-02.svg"}
                    alt="Illustration"
                    width={405}
                    height={325}
                    className="mx-auto opacity-80"
                  />
                </div>

                {/* Feature badges */}
                <div className="mt-12 flex flex-wrap gap-3 justify-center">
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white shadow-lg">
                    🛡️ Secure
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white shadow-lg">
                    ⚡ Fast
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white shadow-lg">
                    🎯 Efficient
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white shadow-lg">
                    📊 Analytics
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2026 NextAdmin HR. All rights reserved.
        </p>
      </div>
    </div>
  );
}
