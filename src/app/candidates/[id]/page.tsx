"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import InterviewScheduler from "@/components/modals/InterviewScheduler";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api-client";

const STATUS_COLORS = {
    RECEIVED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    SHORTLISTED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    TECHNICAL_INTERVIEW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    HR_INTERVIEW: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    SELECTED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    MEDICAL_VISIT: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    OFFER_SENT: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    HIRED: "bg-green-600 text-white",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const OPINION_OPTIONS = [
    { value: "", label: "Non défini" },
    { value: "FAVORABLE", label: "Favorable" },
    { value: "UNFAVORABLE", label: "Défavorable" },
    { value: "PRIORITAIRE", label: "Prioritaire" },
    { value: "PASSABLE", label: "Passable" },
    { value: "STAND_BY", label: "Stand by" },
];

export default function CandidateDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const [candidate, setCandidate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    const [editingOpinion, setEditingOpinion] = useState<"hr" | "manager" | null>(null);
    const [opinionValues, setOpinionValues] = useState({
        hrOpinion: "",
        managerOpinion: "",
    });
    const [savingOpinion, setSavingOpinion] = useState(false);

    useEffect(() => {
        async function fetchCandidate() {
            try {
                const response = await fetch(`/api/candidates/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setCandidate(data);
                    setOpinionValues({
                        hrOpinion: data.hrOpinion || "",
                        managerOpinion: data.managerOpinion || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch candidate:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCandidate();
    }, [params.id]);

    const handleSaveOpinion = async (type: "hr" | "manager") => {
        setSavingOpinion(true);
        try {
            // Check if user has permission (RH or Manager)
            if (user?.role !== "RH" && user?.role !== "Manager") {
                alert("Seuls les utilisateurs RH et Manager peuvent modifier les avis");
                setSavingOpinion(false);
                setEditingOpinion(null);
                return;
            }

            const response = await apiRequest(`/api/candidates/${params.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    [type === "hr" ? "hrOpinion" : "managerOpinion"]: opinionValues[type === "hr" ? "hrOpinion" : "managerOpinion"] || null,
                }),
            });

            if (response.ok) {
                const updatedCandidate = await response.json();
                setCandidate(updatedCandidate);
                setEditingOpinion(null);
                
                // Show message if status was automatically updated
                const oldStatus = candidate.status;
                if (updatedCandidate.status !== oldStatus) {
                    const statusMessages: Record<string, string> = {
                        SHORTLISTED: "Le candidat a été automatiquement présélectionné (Avis RH favorable)",
                        SELECTED: "Le candidat a été automatiquement accepté (Avis RH et Manager favorables)",
                        REJECTED: "Le candidat a été automatiquement refusé (Avis défavorable)",
                    };
                    const message = statusMessages[updatedCandidate.status] || `Le statut a été mis à jour vers: ${updatedCandidate.status}`;
                    alert(`✅ ${message}`);
                } else {
                    alert("✅ Avis enregistré avec succès");
                }
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.error || "Impossible de sauvegarder"}`);
            }
        } catch (error) {
            console.error("Failed to save opinion:", error);
            alert("Erreur lors de la sauvegarde");
        } finally {
            setSavingOpinion(false);
        }
    };

    const handleScheduleInterview = async (date: Date, time: string, type: string, notes: string) => {
        try {
            // Call API to schedule interview
            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidateId: params.id,
                    date: format(date, 'yyyy-MM-dd'),
                    time,
                    type,
                    notes,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to schedule interview');
            }

            const interview = await response.json();
            console.log('Interview scheduled:', interview);

            // Show success message
            alert(`✅ Entretien ${type} planifié avec succès!\n\nDate: ${format(date, 'dd/MM/yyyy')}\nHeure: ${time}\nCandidat: ${candidate.firstName} ${candidate.lastName}`);

            // Refresh candidate data to show the new interview in timeline
            const candidateResponse = await fetch(`/api/candidates/${params.id}`);
            if (candidateResponse.ok) {
                const data = await candidateResponse.json();
                setCandidate(data);
            }
        } catch (error) {
            console.error("Failed to schedule interview:", error);
            alert("❌ Erreur lors de la planification de l'entretien");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-500">Candidat non trouvé</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName={`${candidate.firstName} ${candidate.lastName}`} />

            {/* Header Card */}
            <motion.div
                className="mb-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-6">
                        <motion.div
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl font-bold text-primary"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            {candidate.firstName[0]}{candidate.lastName[0]}
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {candidate.firstName} {candidate.lastName}
                            </h1>
                            <p className="text-white/80 text-lg">{candidate.positionAppliedFor}</p>
                            <p className="text-white/60 text-sm">ID: #{candidate.id}</p>
                        </div>
                    </div>
                    <motion.div
                        className={`rounded-full px-6 py-3 text-lg font-semibold ${STATUS_COLORS[candidate.status as keyof typeof STATUS_COLORS]
                            }`}
                        whileHover={{ scale: 1.1 }}
                    >
                        {candidate.status}
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white border-b pb-2">
                            📋 Informations Personnelles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Email" value={candidate.email} icon="📧" />
                            <InfoItem label="Téléphone" value={candidate.phone || "-"} icon="📱" />
                            <InfoItem
                                label="Date de Naissance"
                                value={candidate.birthDate ? format(new Date(candidate.birthDate), "dd/MM/yyyy") : "-"}
                                icon="🎂"
                            />
                            <InfoItem label="Genre" value={candidate.gender === "MALE" ? "Masculin" : "Féminin"} icon="⚧️" />
                            <InfoItem label="Situation Familiale" value={candidate.familySituation || "-"} icon="👨‍👩‍👧‍👦" />
                            <InfoItem label="Adresse" value={candidate.address || "-"} icon="🏠" className="md:col-span-2" />
                            <InfoItem label="Code Postal" value={candidate.postalCode || "-"} icon="📮" />
                            <InfoItem label="Ville" value={candidate.city || "-"} icon="🌆" />
                            <InfoItem label="Pays" value={candidate.country || "-"} icon="🌍" />
                        </div>
                    </motion.div>

                    {/* Professional Information */}
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white border-b pb-2">
                            💼 Informations Professionnelles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Poste Visé" value={candidate.positionAppliedFor} icon="🎯" />
                            <InfoItem label="Département" value={candidate.department || "-"} icon="🏢" />
                            <InfoItem label="Spécialité" value={candidate.specialty || "-"} icon="⚙️" />
                            <InfoItem label="Niveau" value={candidate.level || "-"} icon="📊" />
                            <InfoItem label="Niveau d'Étude" value={candidate.educationLevel || "-"} icon="🎓" />
                            <InfoItem label="Spécialité d'Étude" value={candidate.studySpecialty || "-"} icon="📚" />
                            <InfoItem label="Expérience" value={candidate.yearsOfExperience ? `${candidate.yearsOfExperience} ans` : "-"} icon="📈" />
                            <InfoItem label="Langue" value={candidate.language || "-"} icon="🗣️" />
                            <InfoItem label="Source" value={candidate.source || "-"} icon="📱" />
                            <InfoItem
                                label="Date de Candidature"
                                value={format(new Date(candidate.createdAt), "dd/MM/yyyy")}
                                icon="📅"
                            />
                        </div>
                    </motion.div>

                    {/* Financial & Admin Information */}
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.32 }}
                    >
                        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white border-b pb-2">
                            💰 Informations Financières & Admin
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem label="Salaire Actuel" value={candidate.currentSalary ? `${candidate.currentSalary} TND` : "-"} icon="💵" />
                            <InfoItem label="Prétention Salariale" value={candidate.salaryExpectation ? `${candidate.salaryExpectation} TND` : "-"} icon="💰" />
                            <InfoItem label="Salaire Proposé" value={candidate.proposedSalary ? `${candidate.proposedSalary} TND` : "-"} icon="🤝" />
                            <InfoItem label="Préavis" value={candidate.noticePeriod || "-"} icon="⏳" />
                            <InfoItem label="Mode de Recrutement" value={candidate.recruitmentMode === "INTERNAL" ? "Interne" : "Externe"} icon="🔄" />
                            <InfoItem label="Site de Travail" value={candidate.workSite || "-"} icon="📍" />
                        </div>
                    </motion.div>

                    {/* Opinions */}
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.34 }}
                    >
                        <div className="mb-4 flex items-center justify-between border-b pb-2">
                            <h3 className="text-xl font-bold text-dark dark:text-white">
                                📝 Avis Initiaux
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Avis RH */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    👤 Avis RH
                                </label>
                                {editingOpinion === "hr" ? (
                                    <div className="space-y-2">
                                        <select
                                            value={opinionValues.hrOpinion}
                                            onChange={(e) => setOpinionValues(prev => ({ ...prev, hrOpinion: e.target.value }))}
                                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:text-white"
                                            disabled={savingOpinion}
                                        >
                                            {OPINION_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2">
                                            <motion.button
                                                onClick={() => handleSaveOpinion("hr")}
                                                disabled={savingOpinion}
                                                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {savingOpinion ? "Enregistrement..." : "Enregistrer"}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    setEditingOpinion(null);
                                                    setOpinionValues({
                                                        hrOpinion: candidate.hrOpinion || "",
                                                        managerOpinion: candidate.managerOpinion || "",
                                                    });
                                                }}
                                                disabled={savingOpinion}
                                                className="rounded-lg border border-stroke px-3 py-2 text-sm font-semibold text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Annuler
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 px-4 py-3 dark:border-dark-3 dark:bg-gray-800">
                                        <span className="font-semibold text-dark dark:text-white">
                                            {candidate.hrOpinion ? OPINION_OPTIONS.find(o => o.value === candidate.hrOpinion)?.label || candidate.hrOpinion : "-"}
                                        </span>
                                        {(user?.role === "RH" || user?.role === "Manager") && (
                                            <motion.button
                                                onClick={() => setEditingOpinion("hr")}
                                                className="text-primary hover:text-primary/80"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                ✏️
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Avis Manager */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    👔 Avis Manager
                                </label>
                                {editingOpinion === "manager" ? (
                                    <div className="space-y-2">
                                        <select
                                            value={opinionValues.managerOpinion}
                                            onChange={(e) => setOpinionValues(prev => ({ ...prev, managerOpinion: e.target.value }))}
                                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark focus:border-primary focus-visible:outline-none dark:border-dark-3 dark:text-white"
                                            disabled={savingOpinion}
                                        >
                                            {OPINION_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2">
                                            <motion.button
                                                onClick={() => handleSaveOpinion("manager")}
                                                disabled={savingOpinion}
                                                className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {savingOpinion ? "Enregistrement..." : "Enregistrer"}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    setEditingOpinion(null);
                                                    setOpinionValues({
                                                        hrOpinion: candidate.hrOpinion || "",
                                                        managerOpinion: candidate.managerOpinion || "",
                                                    });
                                                }}
                                                disabled={savingOpinion}
                                                className="rounded-lg border border-stroke px-3 py-2 text-sm font-semibold text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-gray-800 disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Annuler
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 px-4 py-3 dark:border-dark-3 dark:bg-gray-800">
                                        <span className="font-semibold text-dark dark:text-white">
                                            {candidate.managerOpinion ? OPINION_OPTIONS.find(o => o.value === candidate.managerOpinion)?.label || candidate.managerOpinion : "-"}
                                        </span>
                                        {(user?.role === "RH" || user?.role === "Manager") && (
                                            <motion.button
                                                onClick={() => setEditingOpinion("manager")}
                                                className="text-primary hover:text-primary/80"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                ✏️
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Hiring Request Details */}
                    {candidate.hiringRequest && (
                        <motion.div
                            className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <h3 className="mb-4 text-xl font-bold text-dark dark:text-white border-b pb-2">
                                🏢 Poste Rattaché (Hiring Request)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="ID de la Demande" value={`#${candidate.hiringRequest.id}`} icon="🆔" />
                                <InfoItem label="Titre du Poste" value={candidate.hiringRequest.jobTitle} icon="🏷️" />
                                <InfoItem
                                    label="Recruteur Responsable"
                                    value={candidate.hiringRequest.recruiter ? `${candidate.hiringRequest.recruiter.username}` : "-"}
                                    icon="👤"
                                />
                                <InfoItem label="Service" value={candidate.hiringRequest.service} icon="🏢" />
                                <InfoItem label="Lieu de travail" value={candidate.hiringRequest.workLocation} icon="📍" />
                                <InfoItem label="Type de Contrat" value={candidate.hiringRequest.contractType} icon="📝" />
                            </div>
                        </motion.div>
                    )}

                    {/* Documents */}
                    {candidate.cvPath && (
                        <motion.div
                            className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="mb-4 text-xl font-bold text-dark dark:text-white border-b pb-2">
                                📄 Documents
                            </h3>
                            <div className="flex gap-4">
                                <motion.a
                                    href={candidate.cvPath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 transition flex-1"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                >
                                    <div className="text-3xl">📎</div>
                                    <div>
                                        <p className="font-semibold text-primary">Curriculum Vitae</p>
                                        <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                                    </div>
                                </motion.a>
                                {candidate.documentsPath && (
                                    <motion.a
                                        href={candidate.documentsPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-lg border-2 border-green-600/20 bg-green-600/5 p-4 hover:bg-green-600/10 transition flex-1"
                                        whileHover={{ scale: 1.02, x: 5 }}
                                    >
                                        <div className="text-3xl">📂</div>
                                        <div>
                                            <p className="font-semibold text-green-600">Autres Documents</p>
                                            <p className="text-sm text-gray-500">Dossier complet</p>
                                        </div>
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Comments */}
                    {candidate.recruiterComments && (
                        <motion.div
                            className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="mb-4 text-xl font-bold text-dark dark:text-white border-b pb-2">
                                💬 Commentaires du Recruteur
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {candidate.recruiterComments}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Right Column - Timeline & Actions */}
                <div className="space-y-6">
                    {/* Actions */}
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
                            ⚡ Actions Rapides
                        </h3>
                        <div className="space-y-3">
                            <Link href={`/candidates/${candidate.id}/edit`}>
                                <motion.button
                                    className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white shadow-lg hover:bg-primary/90"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ✏️ Modifier
                                </motion.button>
                            </Link>
                            <motion.button
                                className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white shadow-lg hover:bg-green-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                📧 Envoyer Email
                            </motion.button>
                            <motion.button
                                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSchedulerOpen(true)}
                            >
                                📅 Planifier Entretien
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div
                        className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
                            📊 Historique du Processus
                        </h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {(() => {
                                const events = [
                                    {
                                        id: 'creation',
                                        date: new Date(candidate.createdAt),
                                        title: 'Candidature Reçue',
                                        icon: '📥',
                                        color: 'blue',
                                        description: 'Candidature enregistrée dans le système'
                                    },
                                    ...(candidate.validations || []).map((v: any) => ({
                                        id: `val_${v.id}`,
                                        date: new Date(v.createdAt),
                                        title: `Validation: ${v.stage}`,
                                        icon: '✅',
                                        color: 'green',
                                        description: v.comments,
                                        user: v.validator ? `Validé par: ${v.validator.username}` : undefined
                                    })),
                                    ...(candidate.interviews || []).map((i: any) => ({
                                        id: `int_${i.id}`,
                                        date: new Date(i.scheduledAt),
                                        title: `Entretien ${i.type}`,
                                        icon: '🎯',
                                        color: 'yellow',
                                        description: i.comments,
                                        user: i.interviewer ? `Interviewer: ${i.interviewer.username}` : undefined
                                    })),
                                    ...(candidate.medicalVisit ? [{
                                        id: 'medical',
                                        date: new Date(candidate.medicalVisit.visitDate),
                                        title: 'Visite Médicale',
                                        icon: '🏥',
                                        color: 'teal',
                                        description: `Résultat: ${candidate.medicalVisit.result}. ${candidate.medicalVisit.observations || ''}`
                                    }] : []),
                                    ...(candidate.jobOffer ? [{
                                        id: 'offer',
                                        date: new Date(candidate.jobOffer.sentDate),
                                        title: "Offre d'Emploi",
                                        icon: '📄',
                                        color: 'indigo',
                                        description: `Réponse: ${candidate.jobOffer.response || 'En attente'}`
                                    }] : [])
                                ].sort((a, b) => a.date.getTime() - b.date.getTime());

                                return events.map((event) => (
                                    <TimelineItem
                                        key={event.id}
                                        icon={event.icon}
                                        title={event.title}
                                        date={format(event.date, "dd/MM/yyyy HH:mm")}
                                        color={event.color}
                                        description={event.description}
                                        user={event.user}
                                    />
                                ));
                            })()}
                        </div>
                    </motion.div>

                    {/* Status History */}
                    {candidate.statusHistory && candidate.statusHistory.length > 0 && (
                        <motion.div
                            className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
                                📈 Historique des Changements de Statut
                            </h3>
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {candidate.statusHistory.map((historyItem: any, index: number) => (
                                    <motion.div
                                        key={historyItem.id}
                                        className="relative flex items-start gap-4 pl-8"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                    >
                                        <div className={`absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white dark:border-gray-dark ${STATUS_COLORS[historyItem.newStatus as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-700'}`}>
                                            <span className="text-sm font-bold">
                                                {historyItem.statusLabel.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="flex-1 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-dark dark:text-white">
                                                    {historyItem.statusLabel}
                                                </h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {format(new Date(historyItem.createdAt), "dd/MM/yyyy HH:mm")}
                                                </span>
                                            </div>
                                            {historyItem.oldStatus && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                    <span className="font-medium">De:</span> {historyItem.oldStatus} 
                                                    <span className="mx-2">→</span>
                                                    <span className="font-medium">Vers:</span> {historyItem.newStatus}
                                                </p>
                                            )}
                                            {historyItem.reason && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                    <span className="font-medium">Raison:</span> {historyItem.reason}
                                                </p>
                                            )}
                                            {historyItem.comments && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                    <span className="font-medium">Commentaires:</span> {historyItem.comments}
                                                </p>
                                            )}
                                            {historyItem.changedByUser && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    Modifié par: <span className="font-medium">{historyItem.changedByUser.username}</span> ({historyItem.changedByUser.role})
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Interview Scheduler Modal */}
            <InterviewScheduler
                isOpen={isSchedulerOpen}
                onClose={() => setIsSchedulerOpen(false)}
                onSchedule={handleScheduleInterview}
                candidateName={`${candidate.firstName} ${candidate.lastName}`}
            />
        </motion.div>
    );
}

function InfoItem({ label, value, icon, className = "" }: { label: string; value: string; icon: string; className?: string }) {
    return (
        <motion.div
            className={`${className}`}
            whileHover={{ x: 5 }}
        >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {icon} {label}
            </p>
            <p className="font-semibold text-dark dark:text-white">
                {value}
            </p>
        </motion.div>
    );
}

function TimelineItem({ icon, title, date, color, description, user }: { icon: string; title: string; date: string; color: string; description?: string, user?: string }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
        green: "bg-green-100 text-green-700 dark:bg-green-900/30",
        yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
        teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30",
        indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30",
    };

    return (
        <motion.div
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${colorClasses[color as keyof typeof colorClasses]}`}>
                {icon}
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow dark:bg-gray-dark dark:border-strokedark">
                <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-white">{title}</div>
                    <time className="font-caveat font-medium text-indigo-500 text-sm">{date}</time>
                </div>
                {user && <div className="text-xs text-primary font-medium mb-1">{user}</div>}
                {description && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
                )}
            </div>
        </motion.div>
    );
}

// Add Interview Scheduler Modal at the component level
function CandidateDetailPageWrapper() {
    return (
        <>
            <CandidateDetailPage />
        </>
    );
}
