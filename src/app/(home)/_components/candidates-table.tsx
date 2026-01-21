"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";
import { format } from "date-fns";

interface Candidate {
  _id: string;
  id?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  department: string | null;
  positionAppliedFor: string;
  createdAt: string;
}

export function CandidatesTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates");
      if (response.ok) {
        const result = await response.json();
        const candidatesList = result.data || []; // Extract data array

        // Sort by creation date, newest first
        const sorted = candidatesList
          .sort((a: Candidate, b: Candidate) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 10); // Show latest 10
        setCandidates(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "SHORTLISTED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "HIRED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
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
            👥 Candidats Récents
          </h3>
          <Link
            href="/candidates"
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
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
                  Email
                </th>
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Aucun candidat
                  </td>
                </tr>
              ) : (
                candidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate._id || candidate.id}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-dark dark:text-white">
                      {candidate.firstName} {candidate.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {candidate.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {candidate.positionAppliedFor}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {candidate.department || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          candidate.status
                        )}`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(candidate.createdAt), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/candidates/${candidate._id || candidate.id}`}
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
