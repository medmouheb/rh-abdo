"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { updateCandidate, getCandidate } from "@/app/actions/candidates";
import { getVacantPositions } from "@/app/actions/vacant-positions";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function EditCandidatePage() {
    const router = useRouter();
    const params = useParams();
    const [vacantPositions, setVacantPositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Info
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: new Date(),
        gender: "MALE",
        address: "",


        // Professional Info
        positionAppliedFor: "",
        department: "",
        specialty: "",

        yearsOfExperience: 0,
        language: "",

        // Application Info
        source: "WEBSITE",
        hiringRequestId: 0,
        recruiterComments: "",
        status: "RECEIVED",

        // Extended Info
        educationLevel: "",
        familySituation: "",
        studySpecialty: "",
        currentSalary: 0,
        salaryExpectation: 0,
        proposedSalary: 0,
        noticePeriod: "",
        hrOpinion: "",
        managerOpinion: "",
        recruitmentMode: "EXTERNAL",
        workSite: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [positionsResult, candidateResult] = await Promise.all([
                    getVacantPositions(),
                    getCandidate(parseInt(params.id as string))
                ]);

                if (positionsResult.data) {
                    setVacantPositions(positionsResult.data);
                }

                if (candidateResult.success && candidateResult.data) {
                    const candidate = candidateResult.data;
                    setFormData({
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        email: candidate.email,
                        phone: candidate.phone || "",
                        birthDate: candidate.birthDate ? new Date(candidate.birthDate) : new Date(),
                        gender: candidate.gender,
                        address: candidate.address || "",


                        positionAppliedFor: candidate.positionAppliedFor,
                        department: candidate.department || "",
                        specialty: candidate.specialty || "",

                        yearsOfExperience: candidate.yearsOfExperience || 0,
                        language: candidate.language || "",

                        source: candidate.source || "WEBSITE",
                        hiringRequestId: candidate.hiringRequestId || 0,
                        recruiterComments: candidate.recruiterComments || "",
                        status: candidate.status,

                        educationLevel: candidate.educationLevel || "",
                        familySituation: candidate.familySituation || "",
                        studySpecialty: candidate.studySpecialty || "",
                        currentSalary: candidate.currentSalary || 0,
                        salaryExpectation: candidate.salaryExpectation || 0,
                        proposedSalary: candidate.proposedSalary || 0,
                        noticePeriod: candidate.noticePeriod || "",
                        hrOpinion: candidate.hrOpinion || "",
                        managerOpinion: candidate.managerOpinion || "",
                        recruitmentMode: candidate.recruitmentMode || "EXTERNAL",
                        workSite: candidate.workSite || "",
                    });
                } else {
                    alert("Candidat non trouvé");
                    router.push("/candidates");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.id, router]);

    const handleChange = (field: string, value: any) => {
        let newValue = value;

        // Handle number inputs safety
        if (['yearsOfExperience', 'currentSalary', 'salaryExpectation', 'proposedSalary'].includes(field)) {
            newValue = isNaN(value) ? 0 : value;
        }

        setFormData((prev) => ({ ...prev, [field]: newValue }));

        if (field === "hiringRequestId" && value) {
            const selectedPosition = vacantPositions.find(p => p.id === parseInt(value));
            if (selectedPosition) {
                setFormData(prev => ({
                    ...prev,
                    department: selectedPosition.service,

                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                positionAppliedFor: formData.positionAppliedFor,
                status: formData.status,

                // Optional Strings -> null if empty or undefined
                phone: formData.phone || null,
                department: formData.department || null,
                specialty: formData.specialty || null,
                studySpecialty: formData.studySpecialty || null,

                educationLevel: formData.educationLevel || null,
                language: formData.language || null,
                source: formData.source || null,
                recruitmentMode: formData.recruitmentMode || null,
                workSite: formData.workSite || null,
                noticePeriod: formData.noticePeriod || null,
                hrOpinion: formData.hrOpinion || null,
                managerOpinion: formData.managerOpinion || null,
                recruiterComments: formData.recruiterComments || null,
                familySituation: formData.familySituation || null,
                address: formData.address || null,

                gender: formData.gender || null,

                // Numbers -> null if 0 or NaN (optional)
                yearsOfExperience: formData.yearsOfExperience || null,
                currentSalary: formData.currentSalary || null,
                salaryExpectation: formData.salaryExpectation || null,
                proposedSalary: formData.proposedSalary || null,
                hiringRequestId: formData.hiringRequestId ? parseInt(formData.hiringRequestId.toString()) : null,

                // Dates
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
            };

            const result = await updateCandidate(parseInt(params.id as string), payload);

            if (result.success) {
                router.push(`/candidates/${params.id}`);
            } else {
                console.error("Update failed:", result.error);
                alert("Erreur lors de la mise à jour du candidat: " + (result.error || "Erreur inconnue"));
            }
        } catch (error) {
            console.error("Error updating candidate:", error);
            alert("Erreur lors de la mise à jour du candidat");
        } finally {
            setSubmitting(false);
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName="Modifier Candidat" />

            <motion.div
                className="rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-gray-dark p-6 sm:p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <motion.div
                    className="border-b border-stroke px-6 py-4 dark:border-dark-3 bg-gradient-to-r from-primary/5 to-transparent mb-6"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-bold text-dark dark:text-white text-2xl">
                        📝 Modifier les Informations
                    </h3>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">📋 Informations Personnelles</h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Prénom <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Nom <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Email <span className="text-red">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Date de Naissance
                                </label>
                                <Flatpickr
                                    value={formData.birthDate}
                                    onChange={([date]) => handleChange("birthDate", date)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Genre
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="MALE">Masculin</option>
                                    <option value="FEMALE">Féminin</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Situation Familiale
                                </label>
                                <select
                                    value={formData.familySituation}
                                    onChange={(e) => handleChange("familySituation", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="SINGLE">Célibataire</option>
                                    <option value="MARRIED">Marié(e)</option>
                                    <option value="DIVORCED">Divorcé(e)</option>
                                    <option value="WIDOWED">Veuf/Veuve</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>


                        </div>
                    </motion.div>

                    {/* Professional Information */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">💼 Informations Professionnelles</h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Poste Vacant
                                </label>
                                <select
                                    value={formData.hiringRequestId}
                                    onChange={(e) => handleChange("hiringRequestId", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value={0}>Aucun</option>
                                    {vacantPositions.map((position) => (
                                        <option key={position.id} value={position.id}>
                                            {position.jobTitle} - {position.service}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Poste Visé <span className="text-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.positionAppliedFor}
                                    onChange={(e) => handleChange("positionAppliedFor", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Département
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleChange("department", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Spécialité
                                </label>
                                <input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={(e) => handleChange("specialty", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>



                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Niveau d'Étude
                                </label>
                                <select
                                    value={formData.educationLevel}
                                    onChange={(e) => handleChange("educationLevel", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Bac">Bac</option>
                                    <option value="Bac+2">Bac +2</option>
                                    <option value="Bac+3">Bac +3 (Licence)</option>
                                    <option value="Bac+5">Bac +5 (Ingénieur/Master)</option>
                                    <option value="PhD">Doctorat</option>
                                    <option value="BTP">BTP</option>
                                    <option value="BTS">BTS</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Spécialité d'Étude
                                </label>
                                <input
                                    type="text"
                                    value={formData.studySpecialty}
                                    onChange={(e) => handleChange("studySpecialty", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Années d'Expérience
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.yearsOfExperience}
                                    onChange={(e) => handleChange("yearsOfExperience", parseInt(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Langue
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => handleChange("language", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="FRENCH">Français</option>
                                    <option value="ENGLISH">Anglais</option>
                                    <option value="ARABIC">Arabe</option>
                                    <option value="BILINGUAL">Bilingue</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Financial & Administrative Info */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">💰 Informations Financières & Admin</h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Salaire Actuel (TND)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.currentSalary}
                                    onChange={(e) => handleChange("currentSalary", parseFloat(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Prétention Salariale (TND)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.salaryExpectation}
                                    onChange={(e) => handleChange("salaryExpectation", parseFloat(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Salaire Proposé (TND)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.proposedSalary}
                                    onChange={(e) => handleChange("proposedSalary", parseFloat(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Préavis
                                </label>
                                <input
                                    type="text"
                                    value={formData.noticePeriod}
                                    onChange={(e) => handleChange("noticePeriod", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Mode de Recrutement
                                </label>
                                <select
                                    value={formData.recruitmentMode}
                                    onChange={(e) => handleChange("recruitmentMode", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="EXTERNAL">Externe</option>
                                    <option value="INTERNAL">Interne</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Site de Travail
                                </label>
                                <select
                                    value={formData.workSite}
                                    onChange={(e) => handleChange("workSite", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="TT">TT</option>
                                    <option value="TTG">TTG</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Opinions */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.58 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">📝 Avis</h4>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Avis RH
                                </label>
                                <select
                                    value={formData.hrOpinion}
                                    onChange={(e) => handleChange("hrOpinion", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="FAVORABLE">Favorable</option>
                                    <option value="UNFAVORABLE">Défavorable</option>
                                    <option value="RESERVED">Réservé</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Avis Manager (N+1)
                                </label>
                                <select
                                    value={formData.managerOpinion}
                                    onChange={(e) => handleChange("managerOpinion", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="FAVORABLE">Favorable</option>
                                    <option value="UNFAVORABLE">Défavorable</option>
                                    <option value="RESERVED">Réservé</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Source & Comments */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">📨 Origine de la Candidature</h4>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Source
                                </label>
                                <select
                                    value={formData.source}
                                    onChange={(e) => handleChange("source", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="WEBSITE">Site Web</option>
                                    <option value="LINKEDIN">LinkedIn</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="OTHER">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Commentaires Recruteur
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.recruiterComments}
                                    onChange={(e) => handleChange("recruiterComments", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        className="flex justify-end gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border-2 border-stroke px-8 py-3 font-semibold transition hover:bg-gray-100 dark:border-dark-3 dark:hover:bg-dark-2"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            {submitting ? "⏳ Enregistrement..." : "💾 Enregistrer"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
}
