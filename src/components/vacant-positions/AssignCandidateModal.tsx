"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  hiringRequestId: number | null;
}

interface AssignCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiringRequestId: number;
  onAssignSuccess: () => void;
}

export default function AssignCandidateModal({
  isOpen,
  onClose,
  hiringRequestId,
  onAssignSuccess,
}: AssignCandidateModalProps) {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCandidates();
    }
  }, [isOpen]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/candidates");
      if (response.ok) {
        const data = await response.json();
        // Filter out candidates already assigned to another position (unless it's this one)
        const availableCandidates = data.filter((c: Candidate) => 
          !c.hiringRequestId || c.hiringRequestId === hiringRequestId
        );
        setCandidates(availableCandidates);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedCandidateId) {
      alert("Veuillez sélectionner un candidat");
      return;
    }

    try {
      setAssigning(true);
      const response = await apiRequest(`/api/vacant-positions/${hiringRequestId}/assign-candidate`, {
        method: "POST",
        body: JSON.stringify({ candidateId: selectedCandidateId }),
      });

      if (response.ok) {
        onAssignSuccess();
        onClose();
        alert("✅ Candidature assignée avec succès");
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error || "Impossible d'assigner la candidature"}`);
      }
    } catch (error) {
      console.error("Error assigning candidate:", error);
      alert("Erreur lors de l'assignation");
    } finally {
      setAssigning(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-dark rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-stroke dark:border-dark-3">
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              ✨ Assigner une Candidature
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sélectionnez un candidat à assigner à ce poste
            </p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stroke px-4 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:text-white dark:bg-gray-800"
              />
            </div>

            {/* Candidates List */}
            {loading ? (
              <div className="text-center py-8 text-gray-500">Chargement...</div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun candidat disponible
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCandidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCandidateId === candidate.id
                        ? "border-primary bg-primary/5"
                        : "border-stroke dark:border-dark-3 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-dark dark:text-white">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {candidate.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          candidate.status === "HIRED"
                            ? "bg-green-100 text-green-700"
                            : candidate.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {candidate.status}
                        </span>
                        {selectedCandidateId === candidate.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-primary text-xl"
                          >
                            ✓
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-stroke dark:border-dark-3 flex gap-3 justify-end">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stroke text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Annuler
            </motion.button>
            <motion.button
              onClick={handleAssign}
              disabled={!selectedCandidateId || assigning}
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: selectedCandidateId && !assigning ? 1.05 : 1 }}
              whileTap={{ scale: selectedCandidateId && !assigning ? 0.95 : 1 }}
            >
              {assigning ? "Assignation..." : "Assigner"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
