"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Briefcase, Calendar, Send, Plus, Trash2 } from 'lucide-react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const HiringRequestForm = () => {
    const [formData, setFormData] = useState({
        responsable: '',
        departement: '',
        dateVisite: '',
        dateSouhaitee: '',
        typeRecrutement: 'Externe',
        natureDemande: 'creation',
        remplacementQui: '',
        formationRequise: '',
        competences: '',
        justificationDemande: '',
        modeEmbauche: '',
        site: '',
        responsableRH: '',
        dateDemandeRH: '',
        modificationSite: '',
        besoins: [{ description: '' }],
        cout: '',
        delai: '',
        modelDepSort: false,
        crd: false,
        utilisateurFinal: '',
        cadre: '',
        bu: '',
        email: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const departments = [
        'RH', 'Production', 'Méthode & Indus', 'Finance',
        'supply chain', 'Maintenance', 'HSE', 'Qualité', 'groupe', 'achat'
    ];

    const modeEmbauche = ['CDI', 'CDD', 'Stage', 'Intérim'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        const checked = target.checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBesoinChange = (index: number, value: string) => {
        const newBesoins = [...formData.besoins];
        newBesoins[index].description = value;
        setFormData(prev => ({ ...prev, besoins: newBesoins }));
    };

    const addBesoin = () => {
        setFormData(prev => ({
            ...prev,
            besoins: [...prev.besoins, { description: '' }]
        }));
    };

    const removeBesoin = (index: number) => {
        const newBesoins = formData.besoins.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, besoins: newBesoins }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            // Mapper les données vers le format API existant
            const apiData = {
                requestDate: new Date(),
                personnelType: formData.cadre || "OUVRIER",
                service: formData.departement,
                workLocation: formData.site,
                businessUnit: formData.bu,
                jobTitle: formData.responsable,
                desiredHiringDate: formData.dateSouhaitee ? new Date(formData.dateSouhaitee) : (formData.dateVisite ? new Date(formData.dateVisite) : new Date()),
                reason: formData.natureDemande === 'remplacement' ? "REPLACEMENT" : "CREATION",
                replacementName: formData.remplacementQui,
                recruitmentMode: formData.typeRecrutement,
                contractType: formData.modeEmbauche || "CDI",
                justification: formData.justificationDemande,
                jobCharacteristics: formData.besoins.map(b => b.description).join(', '),
                candidateEducation: formData.formationRequise,
                candidateSkills: formData.competences,
            };

            const response = await fetch("/api/hiring-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) throw new Error("Failed to submit");

            setMessage({ type: 'success', text: 'Demande d\'embauche soumise avec succès!' });

            // Réinitialiser le formulaire après 2 secondes
            setTimeout(() => {
                window.location.href = '/vacant-positions';
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Breadcrumb pageName="Demande d'Embauche" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
            >
                <div className="bg-white dark:bg-gray-dark rounded-xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
                        <div className="flex items-center gap-4">
                            <FileText className="w-12 h-12" />
                            <div>
                                <h1 className="text-3xl font-bold">Demande d'Embauche</h1>
                                <p className="text-white/80 mt-1">Formulaire de demande de recrutement</p>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mx-8 mt-6 p-4 rounded-lg text-white font-medium ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Informations Demandeur */}
                        <motion.div
                            className="border-l-4 border-blue-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Informations Demandeur</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Responsable / Demandeur *
                                    </label>
                                    <input
                                        type="text"
                                        name="responsable"
                                        value={formData.responsable}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Département *
                                    </label>
                                    <select
                                        name="departement"
                                        value={formData.departement}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        required
                                    >
                                        <option value="">Sélectionner un département</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Date de Visite
                                    </label>
                                    <input
                                        type="date"
                                        name="dateVisite"
                                        value={formData.dateVisite}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Date Souhaitée
                                    </label>
                                    <input
                                        type="date"
                                        name="dateSouhaitee"
                                        value={formData.dateSouhaitee}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Type de Recrutement
                                    </label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="typeRecrutement"
                                                value="Interne"
                                                checked={formData.typeRecrutement === 'Interne'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">Interne</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="typeRecrutement"
                                                value="Externe"
                                                checked={formData.typeRecrutement === 'Externe'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">Externe</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Profil Requis */}
                        <motion.div
                            className="border-l-4 border-green-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Briefcase className="w-6 h-6 text-green-600" />
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profil Requis du Candidat</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Formation Requise / Compétences Complémentaires *
                                    </label>
                                    <textarea
                                        name="formationRequise"
                                        value={formData.formationRequise}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        placeholder="Décrivez la formation et les compétences requises..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Compétences Techniques et Comportementales
                                    </label>
                                    <textarea
                                        name="competences"
                                        value={formData.competences}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        placeholder="Listez les compétences techniques et comportementales..."
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Concordance du Poste */}
                        <motion.div
                            className="border-l-4 border-purple-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Concordance du Poste à Pourvoir</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nature de la Demande
                                    </label>
                                    <div className="flex gap-4 mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="natureDemande"
                                                value="creation"
                                                checked={formData.natureDemande === 'creation'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">Création</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="natureDemande"
                                                value="remplacement"
                                                checked={formData.natureDemande === 'remplacement'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">Remplacement</span>
                                        </label>
                                    </div>

                                    {formData.natureDemande === 'remplacement' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mb-4"
                                        >
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Remplacement de :
                                            </label>
                                            <input
                                                type="text"
                                                name="remplacementQui"
                                                value={formData.remplacementQui}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                                placeholder="Nom de la personne à remplacer"
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Justification de la Demande *
                                    </label>
                                    <textarea
                                        name="justificationDemande"
                                        value={formData.justificationDemande}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        placeholder="Expliquez les raisons de cette demande de recrutement..."
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Mode d'Embauche *
                                        </label>
                                        <select
                                            name="modeEmbauche"
                                            value={formData.modeEmbauche}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                            required
                                        >
                                            <option value="">Sélectionner le mode</option>
                                            {modeEmbauche.map(mode => (
                                                <option key={mode} value={mode}>{mode}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Site *
                                        </label>
                                        <input
                                            type="text"
                                            name="site"
                                            value={formData.site}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                            placeholder="TT, TTG, etc."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Liste des Besoins */}
                        <motion.div
                            className="border-l-4 border-orange-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Liste des Besoins du Poste</h2>
                                <motion.button
                                    type="button"
                                    onClick={addBesoin}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Ajouter
                                </motion.button>
                            </div>

                            <div className="space-y-4">
                                {formData.besoins.map((besoin, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={besoin.description}
                                            onChange={(e) => handleBesoinChange(index, e.target.value)}
                                            className="flex-1 px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                            placeholder={`Besoin ${index + 1}...`}
                                        />
                                        {formData.besoins.length > 1 && (
                                            <motion.button
                                                type="button"
                                                onClick={() => removeBesoin(index)}
                                                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Responsable RH */}
                        <motion.div
                            className="border-l-4 border-indigo-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Responsable RH</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nom Responsable RH
                                    </label>
                                    <input
                                        type="text"
                                        name="responsableRH"
                                        value={formData.responsableRH}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Date Demande RH
                                    </label>
                                    <input
                                        type="date"
                                        name="dateDemandeRH"
                                        value={formData.dateDemandeRH}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Coût et Délai */}
                        <motion.div
                            className="border-l-4 border-yellow-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar className="w-6 h-6 text-yellow-600" />
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Coût du Recrutement et Délai</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Coût Estimé (TND)
                                    </label>
                                    <input
                                        type="number"
                                        name="cout"
                                        value={formData.cout}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Délai (jours)
                                    </label>
                                    <input
                                        type="number"
                                        name="delai"
                                        value={formData.delai}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                        placeholder="30"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Vérifications */}
                        <motion.div
                            className="border-l-4 border-red-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Vérifications</h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="modelDepSort"
                                        checked={formData.modelDepSort}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary accent-primary"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Model Dep Sort</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="crd"
                                        checked={formData.crd}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary accent-primary"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">CRD</span>
                                </label>
                            </div>
                        </motion.div>

                        {/* Informations Complémentaires */}
                        <motion.div
                            className="border-l-4 border-teal-500 pl-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Informations Complémentaires</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Utilisateur Final
                                    </label>
                                    <input
                                        type="text"
                                        name="utilisateurFinal"
                                        value={formData.utilisateurFinal}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        CADRE
                                    </label>
                                    <input
                                        type="text"
                                        name="cadre"
                                        value={formData.cadre}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        BU
                                    </label>
                                    <input
                                        type="text"
                                        name="bu"
                                        value={formData.bu}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-stroke dark:border-dark-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent dark:bg-gray-dark dark:text-white transition"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            className="flex justify-end pt-6 border-t-2 border-stroke dark:border-dark-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-bold rounded-lg hover:shadow-xl transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                            >
                                <Send className="w-5 h-5" />
                                {isSubmitting ? 'Envoi en cours...' : 'Soumettre la Demande'}
                            </motion.button>
                        </motion.div>
                    </form>
                </div>

                <motion.div
                    className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> Les champs marqués d'un astérisque (*) sont obligatoires.
                        Assurez-vous de remplir tous les champs requis avant de soumettre votre demande.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HiringRequestForm;
