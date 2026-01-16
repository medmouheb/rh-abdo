"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ReactNode } from "react";
import AnimatedBackground from "@/components/backgrounds/AnimatedBackground";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Hide sidebar and header on auth pages
  const isAuthPage = pathname?.startsWith("/auth");

  // Different background variants for different sections
  const getBackgroundVariant = () => {
    if (pathname?.includes("/recruitment")) return "mesh";
    if (pathname?.includes("/candidates")) return "particles";
    if (pathname?.includes("/hiring-requests")) return "waves";
    if (pathname?.includes("/vacant-positions")) return "gradient";
    if (pathname?.includes("/calendar")) return "geometric";
    return "dots";
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground variant="gradient" opacity={0.2} />
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative">
      <AnimatedBackground variant={getBackgroundVariant()} opacity={0.08} />
      <Sidebar />

      <div className="w-full bg-gray-2/50 dark:bg-[#020d1a]/50 backdrop-blur-sm">
        <Header />

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
