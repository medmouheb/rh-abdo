"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AssignCandidateModal from "./AssignCandidateModal";

interface AssignCandidateButtonProps {
  hiringRequestId: number;
  positionStatus: string;
}

export default function AssignCandidateButton({ hiringRequestId, positionStatus }: AssignCandidateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAssignSuccess = () => {
    setRefreshKey(prev => prev + 1);
    // Trigger a page refresh to show updated candidates
    window.location.reload();
  };

  // Don't show button if position is already HIRED or COMPLETED
  if (positionStatus === "HIRED" || positionStatus === "COMPLETED") {
    return null;
  }

  return (
    <>
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-lg hover:bg-green-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>➕</span>
          <span>Assigner une Candidature Existante</span>
        </motion.button>
      </motion.div>

      <AssignCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hiringRequestId={hiringRequestId}
        onAssignSuccess={handleAssignSuccess}
      />
    </>
  );
}
