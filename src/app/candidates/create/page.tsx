"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createCandidate } from "@/app/actions/candidates";
import { getVacantPositions } from "@/app/actions/vacant-positions";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function CreateCandidatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [vacantPositions, setVacantPositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [cvPreview, setCvPreview] = useState<string>("");
    const [formData, setFormData] = useState({
        // Personal Info
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: new Date(),
        gender: "MALE",
        address: "",
        postalCode: "",
        city: "",
        country: "",

        // Professional Info
        positionAppliedFor: "",
        department: "",
        specialty: "",
        level: "",
        yearsOfExperience: 0,
        language: "",

        // Application Info
        source: "WEBSITE",
        hiringRequestId: null as number | null,
        recruiterComments: "",

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
        async function fetchPositions() {
            const result = await getVacantPositions();
            if (result.data) {
                setVacantPositions(result.data);
                
                // Get hiringRequestId from URL params and set it in form after positions are loaded
                const hiringRequestIdParam = searchParams.get('hiringRequestId');
                if (hiringRequestIdParam) {
                    const id = parseInt(hiringRequestIdParam);
                    if (!isNaN(id)) {
                        // Check if this position exists in the list
                        const positionExists = result.data.some((p: any) => p.id === id);
                        if (positionExists) {
                            setFormData(prev => ({
                                ...prev,
                                hiringRequestId: id,
                            }));
                            
                            // Auto-fill department and job title
                            const selectedPosition = result.data.find((p: any) => p.id === id);
                            if (selectedPosition) {
                                setFormData(prev => ({
                                    ...prev,
                                    department: selectedPosition.service || prev.department,
                                    positionAppliedFor: selectedPosition.jobTitle || prev.positionAppliedFor,
                                }));
                            }
                        }
                    }
                }
            }
        }
        fetchPositions();
    }, [searchParams]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Auto-fill department when position is selected
        if (field === "hiringRequestId" && value !== null && value !== undefined) {
            const positionId = typeof value === 'number' ? value : parseInt(value);
            const selectedPosition = vacantPositions.find(p => p.id === positionId);
            if (selectedPosition) {
                setFormData(prev => ({
                    ...prev,
                    department: selectedPosition.service || prev.department,
                    positionAppliedFor: selectedPosition.jobTitle || prev.positionAppliedFor,
                }));
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert("Format de fichier non valide. Veuillez uploader un PDF ou DOCX.");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Le fichier est trop volumineux. Taille maximale: 5MB");
                return;
            }

            setCvFile(file);
            setCvPreview(file.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First create the candidate
            const result = await createCandidate({
                ...formData,
                hiringRequestId: formData.hiringRequestId || undefined,
            });

            if (result.success && result.data) {
                // Then upload CV if provided
                if (cvFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append("file", cvFile);

                    const uploadResponse = await fetch(`/api/upload/${result.data.id}/cv`, {
                        method: "POST",
                        body: uploadFormData,
                    });

                    if (uploadResponse.ok) {
                        const { path } = await uploadResponse.json();
                        // Update candidate with CV path
                        await fetch(`/api/candidates/${result.data.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ cvPath: path }),
                        });
                    }
                }

                router.push("/candidates");
            } else {
                alert("Erreur lors de la création du candidat");
            }
        } catch (error) {
            console.error("Error creating candidate:", error);
            alert("Erreur lors de la création du candidat");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName="Nouveau Candidat" />

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
                        👤 Informations du Candidat
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
                                <motion.input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: Ahmed"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Nom <span className="text-red">*</span>
                                </label>
                                <motion.input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: Ben Ali"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Email <span className="text-red">*</span>
                                </label>
                                <motion.input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="exemple@email.com"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Téléphone
                                </label>
                                <motion.input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="+216 XX XXX XXX"
                                    whileFocus={{ scale: 1.02 }}
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
                                <motion.input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Adresse complète"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Code Postal
                                </label>
                                <motion.input
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={(e) => handleChange("postalCode", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: 1000"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Ville
                                </label>
                                <motion.input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: Tunis"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Pays
                                </label>
                                <motion.input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => handleChange("country", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: Tunisie"
                                    whileFocus={{ scale: 1.02 }}
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
                                    value={formData.hiringRequestId || ""}
                                    onChange={(e) => handleChange("hiringRequestId", e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner un poste</option>
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
                                <motion.input
                                    type="text"
                                    required
                                    value={formData.positionAppliedFor}
                                    onChange={(e) => handleChange("positionAppliedFor", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: Développeur Full Stack"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Département
                                </label>
                                <motion.input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleChange("department", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: IT"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Spécialité
                                </label>
                                <motion.input
                                    type="text"
                                    value={formData.specialty}
                                    onChange={(e) => handleChange("specialty", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: React, Node.js"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Niveau
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleChange("level", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="JUNIOR">Junior</option>
                                    <option value="INTERMEDIATE">Intermédiaire</option>
                                    <option value="SENIOR">Senior</option>
                                    <option value="EXPERT">Expert</option>
                                </select>
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
                                <motion.input
                                    type="text"
                                    value={formData.studySpecialty}
                                    onChange={(e) => handleChange("studySpecialty", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: Informatique, Gestion..."
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Années d'Expérience
                                </label>
                                <motion.input
                                    type="number"
                                    min="0"
                                    value={formData.yearsOfExperience}
                                    onChange={(e) => handleChange("yearsOfExperience", parseInt(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: 5"
                                    whileFocus={{ scale: 1.02 }}
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
                                <motion.input
                                    type="number"
                                    min="0"
                                    value={formData.currentSalary || ''}
                                    onChange={(e) => handleChange("currentSalary", parseFloat(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="0.000"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Prétention Salariale (TND)
                                </label>
                                <motion.input
                                    type="number"
                                    min="0"
                                    value={formData.salaryExpectation || ''}
                                    onChange={(e) => handleChange("salaryExpectation", parseFloat(e.target.value))}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="0.000"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>

                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    Préavis
                                </label>
                                <motion.input
                                    type="text"
                                    value={formData.noticePeriod}
                                    onChange={(e) => handleChange("noticePeriod", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Ex: 1 mois, Immédiat"
                                    whileFocus={{ scale: 1.02 }}
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

                    {/* Initial Opinions (Optional) */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.58 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">📝 Avis Initiaux (Optionnel)</h4>
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

                    {/* CV Upload Section */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h4 className="mb-4 font-semibold text-lg text-primary">📄 Documents</h4>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white font-medium">
                                    CV (PDF ou DOCX)
                                </label>
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="cv-upload"
                                    />
                                    <label
                                        htmlFor="cv-upload"
                                        className="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-stroke bg-gray-50 px-6 py-8 cursor-pointer transition hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-primary/10"
                                    >
                                        <div className="text-center">
                                            {cvPreview ? (
                                                <>
                                                    <div className="text-4xl mb-2">✅</div>
                                                    <p className="text-sm font-medium text-primary">{cvPreview}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Cliquez pour changer</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-4xl mb-2">📎</div>
                                                    <p className="text-sm font-medium">Cliquez pour uploader le CV</p>
                                                    <p className="text-xs text-gray-500 mt-1">PDF ou DOCX (max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Application Information */}
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
                                <motion.textarea
                                    rows={3}
                                    value={formData.recruiterComments}
                                    onChange={(e) => handleChange("recruiterComments", e.target.value)}
                                    className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2"
                                    placeholder="Notes du recruteur..."
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        className="flex justify-end gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <motion.button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border-2 border-stroke px-8 py-3 font-semibold transition hover:bg-gray-100 dark:border-dark-3 dark:hover:bg-dark-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Annuler
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? "⏳ Création..." : "✅ Créer le Candidat"}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
}
