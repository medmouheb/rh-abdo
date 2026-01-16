"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";

interface ServiceStats {
  service: string;
  totalPositions: number;
  vacant: number;
  inProgress: number;
  hired: number;
  totalCandidates: number;
  hiredCandidates: number;
}

export function ServicesStatisticsTable() {
  const [services, setServices] = useState<ServiceStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [positionsRes, candidatesRes] = await Promise.all([
        fetch("/api/vacant-positions"),
        fetch("/api/candidates"),
      ]);

      const positions = positionsRes.ok ? await positionsRes.json() : [];
      const candidates = candidatesRes.ok ? await candidatesRes.json() : [];

      // Group by service
      const servicesMap = new Map<string, ServiceStats>();

      // Process positions
      positions.forEach((pos: any) => {
        const service = pos.service || "Non spécifié";
        if (!servicesMap.has(service)) {
          servicesMap.set(service, {
            service,
            totalPositions: 0,
            vacant: 0,
            inProgress: 0,
            hired: 0,
            totalCandidates: 0,
            hiredCandidates: 0,
          });
        }
        const stats = servicesMap.get(service)!;
        stats.totalPositions++;
        if (pos.status === "VACANT") stats.vacant++;
        else if (pos.status === "IN_PROGRESS") stats.inProgress++;
        else if (pos.status === "HIRED") stats.hired++;
      });

      // Process candidates
      candidates.forEach((cand: any) => {
        const service = cand.department || "Non spécifié";
        if (!servicesMap.has(service)) {
          servicesMap.set(service, {
            service,
            totalPositions: 0,
            vacant: 0,
            inProgress: 0,
            hired: 0,
            totalCandidates: 0,
            hiredCandidates: 0,
          });
        }
        const stats = servicesMap.get(service)!;
        stats.totalCandidates++;
        if (cand.status === "HIRED") stats.hiredCandidates++;
      });

      const servicesList = Array.from(servicesMap.values()).sort(
        (a, b) => b.totalPositions - a.totalPositions
      );

      setServices(servicesList);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-gray-dark">
        <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <FadeIn>
      <motion.div
        className="rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-dark-3 dark:bg-gray-dark"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          📊 Statistiques par Service
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3 bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Service
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                  Total Postes
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                  Vacants
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                  En Cours
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                  Embauchés
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                  Total Candidats
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-dark dark:text-white">
                  Candidats Embauchés
                </th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Aucune donnée disponible
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <motion.tr
                    key={service.service}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-dark dark:text-white">
                      {service.service}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {service.totalPositions}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                        {service.vacant}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {service.inProgress}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {service.hired}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {service.totalCandidates}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {service.hiredCandidates}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </FadeIn>
  );
}
