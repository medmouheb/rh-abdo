"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";
import { format } from "date-fns";

interface VacantPosition {
  id: number;
  jobTitle: string;
  service: string;
  status: string;
  requestDate: string;
  workLocation: string;
  contractType: string;
  recruiter?: { username: string };
  candidates?: any[];
}

export function VacantPositionsTable() {
  const [positions, setPositions] = useState<VacantPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/vacant-positions");
      if (response.ok) {
        const data = await response.json();
        setPositions(data.slice(0, 10)); // Show latest 10
      }
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VACANT":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "HIRED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-dark dark:text-white">
            📋 Postes Vacants Récents
          </h3>
          <Link
            href="/vacant-positions"
            className="text-sm text-primary hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stroke dark:border-dark-3">
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Poste
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Candidats
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Aucun poste vacant
                  </td>
                </tr>
              ) : (
                positions.map((position, index) => (
                  <motion.tr
                    key={position.id}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-dark dark:text-white">
                      {position.jobTitle}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {position.service}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          position.status
                        )}`}
                      >
                        {position.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {position.requestDate
                        ? format(new Date(position.requestDate), "dd/MM/yyyy")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {position.candidates?.length || 0}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/vacant-positions/${position.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        Voir →
                      </Link>
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
