"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";

interface DashboardStats {
  vacantPositions: {
    total: number;
    vacant: number;
    inProgress: number;
    hired: number;
  };
  candidates: {
    total: number;
    received: number;
    hired: number;
    rejected: number;
  };
  services: {
    total: number;
    list: Array<{ name: string; count: number }>;
  };
}

export function DashboardKPICards() {
  const [stats, setStats] = useState<DashboardStats>({
    vacantPositions: { total: 0, vacant: 0, inProgress: 0, hired: 0 },
    candidates: { total: 0, received: 0, hired: 0, rejected: 0 },
    services: { total: 0, list: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [positionsRes, candidatesRes] = await Promise.all([
        fetch("/api/vacant-positions"),
        fetch("/api/candidates"),
      ]);

      const positions = positionsRes.ok ? await positionsRes.json() : [];
      const candidates = candidatesRes.ok ? await candidatesRes.json() : [];

      // Calculate vacant positions stats
      const vacantPositions = {
        total: positions.length,
        vacant: positions.filter((p: any) => p.status === "VACANT").length,
        inProgress: positions.filter((p: any) => p.status === "IN_PROGRESS").length,
        hired: positions.filter((p: any) => p.status === "HIRED").length,
      };

      // Calculate candidates stats
      const candidatesStats = {
        total: candidates.length,
        received: candidates.filter((c: any) => c.status === "RECEIVED").length,
        hired: candidates.filter((c: any) => c.status === "HIRED").length,
        rejected: candidates.filter((c: any) => c.status === "REJECTED").length,
      };

      // Calculate services stats
      const servicesMap = new Map<string, number>();
      positions.forEach((p: any) => {
        const service = p.service || "Non spécifié";
        servicesMap.set(service, (servicesMap.get(service) || 0) + 1);
      });

      const servicesList = Array.from(servicesMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setStats({
        vacantPositions,
        candidates: candidatesStats,
        services: { total: servicesMap.size, list: servicesList },
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Postes Vacants",
      value: stats.vacantPositions.total,
      icon: "🏢",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300",
      details: [
        { label: "Vacants", value: stats.vacantPositions.vacant },
        { label: "En cours", value: stats.vacantPositions.inProgress },
        { label: "Embauchés", value: stats.vacantPositions.hired },
      ],
      link: "/vacant-positions",
    },
    {
      title: "Candidats",
      value: stats.candidates.total,
      icon: "👥",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300",
      details: [
        { label: "Reçus", value: stats.candidates.received },
        { label: "Embauchés", value: stats.candidates.hired },
        { label: "Refusés", value: stats.candidates.rejected },
      ],
      link: "/candidates",
    },
    {
      title: "Services",
      value: stats.services.total,
      icon: "🏭",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300",
      details: stats.services.list.slice(0, 3).map((s) => ({
        label: s.name,
        value: s.count,
      })),
      link: "/vacant-positions",
    },
    {
      title: "En Cours",
      value: stats.vacantPositions.inProgress + stats.candidates.received,
      icon: "⏳",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-300",
      details: [
        { label: "Postes en cours", value: stats.vacantPositions.inProgress },
        { label: "Candidats reçus", value: stats.candidates.received },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, index) => (
        <FadeIn key={card.title} delay={index * 0.1}>
          <Link href={card.link || "#"} className="block h-full">
            <motion.div
              className={`relative overflow-hidden rounded-xl border-2 border-transparent ${card.bgColor} p-6 shadow-lg transition-all hover:border-primary/50 hover:shadow-xl h-full`}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br ${card.color} opacity-10`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-md`}
                  >
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <motion.div
                    className={`text-3xl font-bold ${card.textColor}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {card.value}
                  </motion.div>
                </div>

                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                  {card.title}
                </h3>

                {/* Details */}
                <div className="space-y-2">
                  {card.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {detail.label}:
                      </span>
                      <span
                        className={`font-semibold ${card.textColor} dark:text-white`}
                      >
                        {detail.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
