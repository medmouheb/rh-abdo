"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Stepper from "@/components/Stepper";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
    "General Info",
    "Job Details",
    "Justification",
    "Requirements",
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export default function CreateHiringRequestPage() {
    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        requestDate: new Date(),
        personnelType: "OUVRIER",
        service: "",
        workLocation: "",
        businessUnit: "",
        jobTitle: "",
        desiredHiringDate: new Date(),
        reason: "REPLACEMENT",
        replacementName: "",
        departureReason: "DEMISSION",
        increaseStartDate: new Date(),
        increaseEndDate: new Date(),
        contractType: "CDI",
        justification: "",
        jobCharacteristics: "",
        candidateEducation: "",
        candidateSkills: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep((curr) => curr + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep((curr) => curr - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch("/api/hiring-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    dateRangeStart: formData.increaseStartDate,
                    dateRangeEnd: formData.increaseEndDate,
                }),
            });

            if (!response.ok) throw new Error("Failed to submit");
            setMessage({ type: "success", text: "Hiring request submitted successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumb pageName="Demande d'Autorisation d'Embauche" />

            <motion.div
                className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-6 sm:p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Stepper steps={STEPS} currentStep={currentStep} />

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`mt-6 p-4 rounded-lg text-white font-medium shadow-lg ${message.type === "success"
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : "bg-gradient-to-r from-red-500 to-red-600"
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="mt-8">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: GENERAL INFO */}
                        {currentStep === 0 && (
                            <motion.div
                                key="step-0"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -50 }}
                                className="flex flex-col gap-6"
                            >
                                <motion.div
                                    className="flex flex-col gap-6 xl:flex-row"
                                    variants={itemVariants}
                                >
                                    <div className="w-full xl:w-1/2">
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            📅 Date de la demande
                                        </motion.label>
                                        <motion.div whileFocus={{ scale: 1.02 }}>
                                            <Flatpickr
                                                value={formData.requestDate}
                                                onChange={([date]) => handleChange("requestDate", date)}
                                                className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            />
                                        </motion.div>
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            👤 Type de Personnel
                                        </motion.label>
                                        <div className="flex items-center gap-4 py-3">
                                            {[
                                                { value: "OUVRIER", emoji: "🔧" },
                                                { value: "ETAM", emoji: "💼" },
                                                { value: "CADRE", emoji: "👔" }
                                            ].map((type) => (
                                                <motion.label
                                                    key={type.value}
                                                    className="flex items-center gap-2 cursor-pointer capitalize"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="personnelType"
                                                        className="h-5 w-5 text-primary accent-primary"
                                                        checked={formData.personnelType === type.value}
                                                        onChange={() => handleChange("personnelType", type.value)}
                                                    />
                                                    <span className="font-medium">{type.emoji} {type.value.toLowerCase()}</span>
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="grid grid-cols-1 gap-6 xl:grid-cols-3"
                                    variants={itemVariants}
                                >
                                    <div>
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            🏢 Service
                                        </motion.label>
                                        <motion.input
                                            type="text"
                                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            value={formData.service}
                                            onChange={(e) => handleChange("service", e.target.value)}
                                            whileFocus={{ scale: 1.02 }}
                                            placeholder="Ex: Ressources Humaines"
                                        />
                                    </div>
                                    <div>
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            📍 Lieu de Travail
                                        </motion.label>
                                        <motion.input
                                            type="text"
                                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            value={formData.workLocation}
                                            onChange={(e) => handleChange("workLocation", e.target.value)}
                                            whileFocus={{ scale: 1.02 }}
                                            placeholder="Ex: Paris"
                                        />
                                    </div>
                                    <div>
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            🏭 BU
                                        </motion.label>
                                        <motion.input
                                            type="text"
                                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            value={formData.businessUnit}
                                            onChange={(e) => handleChange("businessUnit", e.target.value)}
                                            whileFocus={{ scale: 1.02 }}
                                            placeholder="Ex: BU France"
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* STEP 2: JOB DETAILS */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step-1"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -50 }}
                                className="flex flex-col gap-6"
                            >
                                <motion.div
                                    className="flex flex-col gap-6 xl:flex-row"
                                    variants={itemVariants}
                                >
                                    <div className="w-full xl:w-1/2">
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            💼 Libellé du Poste
                                        </motion.label>
                                        <motion.input
                                            type="text"
                                            className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            value={formData.jobTitle}
                                            onChange={(e) => handleChange("jobTitle", e.target.value)}
                                            whileFocus={{ scale: 1.02 }}
                                            placeholder="Ex: Développeur Full Stack"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <motion.label
                                            className="mb-2.5 block text-black dark:text-white font-semibold"
                                            whileHover={{ x: 5 }}
                                        >
                                            📆 Date souhaitée d'engagement
                                        </motion.label>
                                        <motion.div whileFocus={{ scale: 1.02 }}>
                                            <Flatpickr
                                                value={formData.desiredHiringDate}
                                                onChange={([date]) => handleChange("desiredHiringDate", date)}
                                                className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 dark:from-primary/10 dark:to-primary/20"
                                    variants={itemVariants}
                                >
                                    <motion.label
                                        className="mb-4 block font-bold text-lg text-black dark:text-white"
                                        whileHover={{ x: 5 }}
                                    >
                                        📝 Type de Contrat
                                    </motion.label>
                                    <div className="flex gap-8">
                                        {["CDI", "CDD"].map((type) => (
                                            <motion.label
                                                key={type}
                                                className="flex items-center gap-3 cursor-pointer font-medium text-lg"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="contractType"
                                                    className="h-6 w-6 text-primary accent-primary"
                                                    checked={formData.contractType === type}
                                                    onChange={() => handleChange("contractType", type)}
                                                />
                                                <span>{type}</span>
                                            </motion.label>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* STEP 3: JUSTIFICATION */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step-2"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -50 }}
                                className="flex flex-col gap-6"
                            >
                                <motion.div
                                    className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20"
                                    variants={itemVariants}
                                >
                                    <h4 className="mb-6 font-bold text-xl text-primary">🎯 Motif de la demande</h4>
                                    <div className="flex flex-col gap-4">
                                        {[
                                            { value: "REPLACEMENT", label: "En Remplacement", emoji: "🔄" },
                                            { value: "BUDGETED", label: "Augmentation Effectif Budgété", emoji: "📊" },
                                            { value: "NON_BUDGETED", label: "Augmentation Non Budgété", emoji: "📈" }
                                        ].map((reason) => (
                                            <div key={reason.value} className="flex flex-col gap-2">
                                                <motion.label
                                                    className="flex items-center gap-3 cursor-pointer font-medium text-lg"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        className="h-5 w-5 text-primary accent-primary"
                                                        checked={formData.reason === reason.value}
                                                        onChange={() => handleChange("reason", reason.value)}
                                                    />
                                                    <span>{reason.emoji} {reason.label}</span>
                                                </motion.label>
                                                {formData.reason === "REPLACEMENT" && reason.value === "REPLACEMENT" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="ml-8 flex flex-col gap-3"
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="Qui remplace-t-on ?"
                                                            className="w-full rounded-lg border-2 border-stroke px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-strokedark dark:bg-form-input"
                                                            value={formData.replacementName}
                                                            onChange={(e) => handleChange("replacementName", e.target.value)}
                                                        />
                                                        <select
                                                            className="w-full rounded-lg border-2 border-stroke px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-strokedark dark:bg-form-input"
                                                            value={formData.departureReason}
                                                            onChange={(e) => handleChange("departureReason", e.target.value)}
                                                        >
                                                            <option value="DEMISSION">Démission</option>
                                                            <option value="MUTATION">Mutation</option>
                                                            <option value="LICENCIEMENT">Licenciement</option>
                                                            <option value="RETRAITE">Retraite</option>
                                                            <option value="AUTRE">Autre</option>
                                                        </select>
                                                    </motion.div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <motion.label
                                        className="mb-3 block font-semibold text-lg text-black dark:text-white"
                                        whileHover={{ x: 5 }}
                                    >
                                        ✍️ Justification précise
                                    </motion.label>
                                    <motion.textarea
                                        rows={4}
                                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                        value={formData.justification}
                                        onChange={(e) => handleChange("justification", e.target.value)}
                                        whileFocus={{ scale: 1.01 }}
                                        placeholder="Décrivez les raisons de cette demande..."
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <motion.label
                                        className="mb-3 block font-semibold text-lg text-black dark:text-white"
                                        whileHover={{ x: 5 }}
                                    >
                                        🎯 Caractéristiques du Poste
                                    </motion.label>
                                    <motion.textarea
                                        rows={4}
                                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                        value={formData.jobCharacteristics}
                                        onChange={(e) => handleChange("jobCharacteristics", e.target.value)}
                                        whileFocus={{ scale: 1.01 }}
                                        placeholder="Décrivez les principales missions et responsabilités..."
                                    />
                                </motion.div>
                            </motion.div>
                        )}

                        {/* STEP 4: REQUIREMENTS */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -50 }}
                                className="flex flex-col gap-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <motion.label
                                        className="mb-3 block font-semibold text-lg text-black dark:text-white"
                                        whileHover={{ x: 5 }}
                                    >
                                        🎓 Formation Souhaitée
                                    </motion.label>
                                    <motion.textarea
                                        rows={4}
                                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                        value={formData.candidateEducation}
                                        onChange={(e) => handleChange("candidateEducation", e.target.value)}
                                        whileFocus={{ scale: 1.01 }}
                                        placeholder="Ex: Bac+5 en informatique, Master en gestion..."
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <motion.label
                                        className="mb-3 block font-semibold text-lg text-black dark:text-white"
                                        whileHover={{ x: 5 }}
                                    >
                                        ⭐ Compétences Indispensables
                                    </motion.label>
                                    <motion.textarea
                                        rows={4}
                                        className="w-full rounded-lg border-2 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                        value={formData.candidateSkills}
                                        onChange={(e) => handleChange("candidateSkills", e.target.value)}
                                        whileFocus={{ scale: 1.01 }}
                                        placeholder="Ex: React, Node.js, leadership, communication..."
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* NAVIGATION BUTTONS */}
                    <motion.div
                        className="mt-10 flex justify-between border-t-2 border-stroke pt-6 dark:border-strokedark"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`rounded-lg px-8 py-3 font-semibold border-2 border-stroke transition-all shadow-md ${currentStep === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-100 hover:shadow-lg dark:border-strokedark dark:hover:bg-meta-4"
                                }`}
                            whileHover={currentStep !== 0 ? { scale: 1.05, x: -5 } : {}}
                            whileTap={currentStep !== 0 ? { scale: 0.95 } : {}}
                        >
                            ⬅️ Précédent
                        </motion.button>

                        {currentStep < STEPS.length - 1 ? (
                            <motion.button
                                type="button"
                                onClick={nextStep}
                                className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Suivant ➡️
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isSubmitting ? { rotate: [0, 5, -5, 0] } : {}}
                                transition={isSubmitting ? { repeat: Infinity, duration: 0.5 } : {}}
                            >
                                {isSubmitting ? "⏳ Envoi..." : "✅ Soumettre la Demande"}
                            </motion.button>
                        )}
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
}
