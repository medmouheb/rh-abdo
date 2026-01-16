"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, DollarSign, UserCheck, Plus, X, Save, Trash2,
    Edit2, Calendar, Briefcase, MapPin, Clock, CheckCircle,
    AlertCircle, TrendingUp, FileText, Sparkles, UserPlus, XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface Candidate {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    status: string;
    appliedAt?: string;
}

interface VacantPositionManagerProps {
    positionId: number;
    initialData: {
        jobTitle: string;
        service: string;
        workLocation?: string;
        contractType: string;
        status: string;
        budget?: number;
        recruiter?: {
            id: number;
            username: string;
        };
        candidates: Candidate[];
    };
    availableCandidates: Candidate[];
    availableRecruiters: Array<{ id: number; username: string; role: string }>;
}

export default function VacantPositionManager({
    positionId,
    initialData,
    availableCandidates,
    availableRecruiters
}: VacantPositionManagerProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"candidates" | "budget" | "responsible">("candidates");
    const [loading, setLoading] = useState(false);
    const [positionStatus, setPositionStatus] = useState(initialData.status);

    // Candidates Management
    const [assignedCandidates, setAssignedCandidates] = useState<Candidate[]>(initialData.candidates || []);
    const [showAddCandidate, setShowAddCandidate] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

    // Budget Management
    const [budget, setBudget] = useState<number>(initialData.budget || 0);
    const [editingBudget, setEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState<number>(budget);

    // Responsible Management
    const [responsibleId, setResponsibleId] = useState<number | null>(initialData.recruiter?.id || null);
    const [editingResponsible, setEditingResponsible] = useState(false);
    const [tempResponsibleId, setTempResponsibleId] = useState<number | null>(responsibleId);

    // Add Candidate to Position
    const handleAddCandidate = async () => {
        if (!selectedCandidateId) return;

        setLoading(true);
        try {
            const response = await apiRequest(`/api/hiring-requests/${positionId}/candidates`, {
                method: "POST",
                body: JSON.stringify({ candidateId: selectedCandidateId })
            });

            if (response.ok) {
                const newCandidate = availableCandidates.find(c => c.id === selectedCandidateId);
                if (newCandidate) {
                    setAssignedCandidates([...assignedCandidates, newCandidate]);
                }
                setShowAddCandidate(false);
                setSelectedCandidateId(null);
                router.refresh();
            }
        } catch (error) {
            console.error("Error adding candidate:", error);
            alert("Erreur lors de l'ajout du candidat");
        } finally {
            setLoading(false);
        }
    };

    // Accept/Hire Candidate and Close Position
    const handleHireCandidate = async (candidateId: number, candidateName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir embaucher ${candidateName}? Le poste sera automatiquement fermé.`)) return;

        setLoading(true);
        try {
            // Update candidate status to HIRED
            const candidateResponse = await apiRequest(`/api/candidates/${candidateId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "HIRED" })
            });

            if (!candidateResponse.ok) {
                throw new Error("Failed to update candidate status");
            }

            // Close the position (set status to CLOSED or FILLED)
            const positionResponse = await apiRequest(`/api/hiring-requests/${positionId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "CLOSED" })
            });

            if (positionResponse.ok) {
                setPositionStatus("CLOSED");
                // Update the candidate in the list
                setAssignedCandidates(assignedCandidates.map(c =>
                    c.id === candidateId ? { ...c, status: "HIRED" } : c
                ));
                alert(`${candidateName} a été embauché(e) avec succès! Le poste est maintenant fermé.`);
                router.refresh();
            }
        } catch (error) {
            console.error("Error hiring candidate:", error);
            alert("Erreur lors de l'embauche du candidat");
        } finally {
            setLoading(false);
        }
    };

    // Reject Candidate
    const handleRejectCandidate = async (candidateId: number, candidateName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir rejeter la candidature de ${candidateName}?`)) return;

        setLoading(true);
        try {
            const response = await apiRequest(`/api/candidates/${candidateId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "REJECTED" })
            });

            if (response.ok) {
                // Update the candidate in the list
                setAssignedCandidates(assignedCandidates.map(c =>
                    c.id === candidateId ? { ...c, status: "REJECTED" } : c
                ));
                router.refresh();
            }
        } catch (error) {
            console.error("Error rejecting candidate:", error);
            alert("Erreur lors du rejet du candidat");
        } finally {
            setLoading(false);
        }
    };

    // Remove Candidate from Position
    const handleRemoveCandidate = async (candidateId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir retirer ce candidat?")) return;

        setLoading(true);
        try {
            const response = await apiRequest(`/api/hiring-requests/${positionId}/candidates/${candidateId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setAssignedCandidates(assignedCandidates.filter(c => c.id !== candidateId));
                router.refresh();
            }
        } catch (error) {
            console.error("Error removing candidate:", error);
            alert("Erreur lors de la suppression du candidat");
        } finally {
            setLoading(false);
        }
    };

    // Update Budget
    const handleSaveBudget = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(`/api/hiring-requests/${positionId}`, {
                method: "PATCH",
                body: JSON.stringify({ budget: tempBudget })
            });

            if (response.ok) {
                setBudget(tempBudget);
                setEditingBudget(false);
            }
        } catch (error) {
            console.error("Error updating budget:", error);
            alert("Erreur lors de la mise à jour du budget");
        } finally {
            setLoading(false);
        }
    };

    // Update Responsible Person
    const handleSaveResponsible = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(`/api/hiring-requests/${positionId}`, {
                method: "PATCH",
                body: JSON.stringify({ recruiterId: tempResponsibleId })
            });

            if (response.ok) {
                setResponsibleId(tempResponsibleId);
                setEditingResponsible(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Error updating responsible:", error);
            alert("Erreur lors de la mise à jour du responsable");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            "NEW": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            "SCREENING": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            "INTERVIEW": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            "OFFER": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            "HIRED": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            "REJECTED": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        };
        return colors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    };

    const unassignedCandidates = availableCandidates.filter(
        c => !assignedCandidates.some(ac => ac.id === c.id)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-slate-200/60 bg-white dark:border-slate-700/50 dark:bg-boxdark shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden backdrop-blur-sm"
        >
            {/* Header with Gradient */}
            <motion.div
                className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />

                <div className="relative z-10 flex items-center justify-between">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Sparkles className="w-6 h-6" />
                            </motion.div>
                            <h2 className="text-3xl font-bold tracking-tight">{initialData.jobTitle}</h2>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-indigo-100">
                            <motion.span
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Briefcase className="w-4 h-4" />
                                {initialData.service}
                            </motion.span>
                            <motion.span
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full"
                                whileHover={{ scale: 1.05 }}
                            >
                                <MapPin className="w-4 h-4" />
                                {initialData.workLocation || "Non spécifié"}
                            </motion.span>
                            <motion.span
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full"
                                whileHover={{ scale: 1.05 }}
                            >
                                <FileText className="w-4 h-4" />
                                {initialData.contractType}
                            </motion.span>
                        </div>
                    </motion.div>
                    <motion.div
                        className="text-right"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold shadow-lg"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {initialData.status}
                        </motion.span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Tabs with Glassmorphism */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                {[
                    { key: "candidates", icon: Users, label: "Candidats", count: assignedCandidates.length },
                    { key: "budget", icon: DollarSign, label: "Budget", count: null },
                    { key: "responsible", icon: UserCheck, label: "Responsable", count: null },
                ].map((tab, index) => (
                    <motion.button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex-1 px-6 py-4 font-semibold transition-all relative group ${activeTab === tab.key
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                            {tab.count !== null && (
                                <motion.span
                                    className="ml-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                >
                                    {tab.count}
                                </motion.span>
                            )}
                        </div>
                        {activeTab === tab.key && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/50 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                    </motion.button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
                <AnimatePresence mode="wait">
                    {/* CANDIDATES TAB */}
                    {activeTab === "candidates" && (
                        <motion.div
                            key="candidates"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <motion.h3
                                    className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"
                                    initial={{ x: -20 }}
                                    animate={{ x: 0 }}
                                >
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    Candidats Assignés
                                </motion.h3>
                                <motion.button
                                    onClick={() => setShowAddCandidate(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all font-semibold"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter Candidat
                                </motion.button>
                            </div>

                            {assignedCandidates.length === 0 ? (
                                <motion.div
                                    className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Users className="w-20 h-20 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                                    </motion.div>
                                    <p className="text-slate-500 font-medium">Aucun candidat assigné</p>
                                    <p className="text-sm text-slate-400 mt-1">Cliquez sur "Ajouter Candidat" pour commencer</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {assignedCandidates.map((candidate, index) => (
                                        <motion.div
                                            key={candidate.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative flex items-center justify-between p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
                                            whileHover={{ scale: 1.02, y: -4 }}
                                        >
                                            {/* Gradient Accent Border */}
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />

                                            <div className="flex items-center gap-4 flex-1">
                                                <motion.div
                                                    className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">
                                                        {candidate.firstName} {candidate.lastName}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        {candidate.email && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                                {candidate.email}
                                                            </span>
                                                        )}
                                                        {candidate.phone && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                                {candidate.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <motion.span
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getStatusColor(candidate.status)}`}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {candidate.status}
                                                </motion.span>
                                            </div>
                                            <motion.button
                                                onClick={() => handleRemoveCandidate(candidate.id)}
                                                className="ml-4 p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shadow-sm hover:shadow-md"
                                                disabled={loading}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Add Candidate Modal */}
                            <AnimatePresence>
                                {showAddCandidate && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                        onClick={() => setShowAddCandidate(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            exit={{ scale: 0.9, y: 20 }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-white dark:bg-boxdark rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                                    Ajouter un Candidat
                                                </h3>
                                                <button
                                                    onClick={() => setShowAddCandidate(false)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-meta-4 rounded-lg"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {unassignedCandidates.length === 0 ? (
                                                <p className="text-center py-8 text-slate-500">
                                                    Tous les candidats disponibles sont déjà assignés
                                                </p>
                                            ) : (
                                                <div className="space-y-3 mb-6">
                                                    {unassignedCandidates.map((candidate) => (
                                                        <div
                                                            key={candidate.id}
                                                            onClick={() => setSelectedCandidateId(candidate.id)}
                                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCandidateId === candidate.id
                                                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                                                : "border-slate-200 dark:border-strokedark hover:border-indigo-300"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                                                    {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-slate-800 dark:text-white">
                                                                        {candidate.firstName} {candidate.lastName}
                                                                    </h4>
                                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                        {candidate.email}
                                                                    </p>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(candidate.status)}`}>
                                                                    {candidate.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setShowAddCandidate(false)}
                                                    className="px-4 py-2 border border-slate-300 dark:border-strokedark rounded-lg hover:bg-slate-50 dark:hover:bg-meta-4"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleAddCandidate}
                                                    disabled={!selectedCandidateId || loading}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? "Ajout..." : "Ajouter"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* BUDGET TAB */}
                    {activeTab === "budget" && (
                        <motion.div
                            key="budget"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                            Budget Alloué
                                        </h3>
                                        {!editingBudget && (
                                            <button
                                                onClick={() => {
                                                    setEditingBudget(true);
                                                    setTempBudget(budget);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Modifier
                                            </button>
                                        )}
                                    </div>

                                    {editingBudget ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Montant (DT)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={tempBudget}
                                                    onChange={(e) => setTempBudget(parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-3 text-2xl font-bold border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-meta-4 dark:border-strokedark"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setEditingBudget(false)}
                                                    className="px-4 py-2 border border-slate-300 dark:border-strokedark rounded-lg hover:bg-slate-50 dark:hover:bg-meta-4"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleSaveBudget}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {loading ? "Enregistrement..." : "Enregistrer"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-600" />
                                            <p className="text-5xl font-bold text-green-600 mb-2">
                                                {budget.toLocaleString("fr-TN")} DT
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Budget total alloué pour ce poste
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* RESPONSIBLE TAB */}
                    {activeTab === "responsible" && (
                        <motion.div
                            key="responsible"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                            Responsable du Service
                                        </h3>
                                        {!editingResponsible && (
                                            <button
                                                onClick={() => {
                                                    setEditingResponsible(true);
                                                    setTempResponsibleId(responsibleId);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Modifier
                                            </button>
                                        )}
                                    </div>

                                    {editingResponsible ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Sélectionner un responsable
                                                </label>
                                                <select
                                                    value={tempResponsibleId || ""}
                                                    onChange={(e) => setTempResponsibleId(parseInt(e.target.value) || null)}
                                                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-meta-4 dark:border-strokedark"
                                                >
                                                    <option value="">Non assigné</option>
                                                    {availableRecruiters.map((recruiter) => (
                                                        <option key={recruiter.id} value={recruiter.id}>
                                                            {recruiter.username} ({recruiter.role})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setEditingResponsible(false)}
                                                    className="px-4 py-2 border border-slate-300 dark:border-strokedark rounded-lg hover:bg-slate-50 dark:hover:bg-meta-4"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleSaveResponsible}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {loading ? "Enregistrement..." : "Enregistrer"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            {responsibleId ? (
                                                <>
                                                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                                                        {availableRecruiters.find(r => r.id === responsibleId)?.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                                                        {availableRecruiters.find(r => r.id === responsibleId)?.username}
                                                    </p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {availableRecruiters.find(r => r.id === responsibleId)?.role}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                                                    <p className="text-lg text-slate-600 dark:text-slate-400">
                                                        Aucun responsable assigné
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
