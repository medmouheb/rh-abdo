"use client";

import { useState, useEffect } from 'react';
import { Bell, FileText, Send, Plus, X, Clock, AlertCircle, TrendingUp, Users, CheckCircle, Briefcase, ChevronRight, Filter, Calendar as CalendarIcon, UserCheck, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { apiRequest } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';

interface HiringRequest {
  _id?: string;
  id?: number | string; // Made id optional
  jobTitle: string;
  service: string;
  workLocation?: string;
  contractType: string;
  personnelType?: string; // e.g. CADRE, ETAM
  reason?: string; // e.g. REPLACEMENT
  justification: string;
  status: string;
  createdAt: string;
  desiredHiringDate?: string;
  recruitmentMode?: string;
  recruiter?: {
    id: number;
    username: string;
    role: string;
  };
  candidates?: Array<{
    id: number;
    firstName: string;
    lastName: string;
    status: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const HiringRequestsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    urgent: 0
  });

  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split('T')[0],
    service: '',
    workLocation: '',
    businessUnit: '',
    personnelType: 'CADRE',
    jobTitle: '',
    desiredHiringDate: '',
    reason: 'REPLACEMENT', // Default
    replacementName: '',
    departureReason: '',
    dateRangeStart: '',
    dateRangeEnd: '',
    contractType: 'CDI',
    justification: '',
    jobCharacteristics: '',
    candidateEducation: '',
    candidateSkills: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchHiringRequests();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Calculate stats based on loaded requests
    const total = hiringRequests.length;
    const active = hiringRequests.filter(r => ['VACANT', 'IN_PROGRESS'].includes(r.status)).length;
    const completed = hiringRequests.filter(r => ['HIRED', 'COMPLETED'].includes(r.status)).length;
    // Mock urgent logic: e.g. created > 30 days ago and still active
    const urgent = hiringRequests.filter(r => {
      const daysOld = (new Date().getTime() - new Date(r.createdAt).getTime()) / (1000 * 3600 * 24);
      return ['VACANT'].includes(r.status) && daysOld > 30;
    }).length;

    setStats({ total, active, completed, urgent });
  }, [hiringRequests]);

  const fetchHiringRequests = async () => {
    try {
      const response = await apiRequest('/api/hiring-requests');
      if (response.ok) {
        const result = await response.json();
        setHiringRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching hiring requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async () => {
    const requiredFields = [
      'requestDate', 'service', 'workLocation', 'jobTitle',
      'desiredHiringDate', 'reason', 'contractType',
      'justification', 'jobCharacteristics', 'candidateEducation', 'candidateSkills'
    ];

    const missing = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missing.length > 0) {
      alert(`Veuillez remplir tous les champs obligatoires: ${missing.join(', ')}`);
      return;
    }

    try {
      const response = await apiRequest('/api/hiring-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Demande d\'embauche créée avec succès!');
        setFormData({
          requestDate: new Date().toISOString().split('T')[0],
          service: '', workLocation: '', businessUnit: '', personnelType: 'CADRE',
          jobTitle: '', desiredHiringDate: '', reason: 'REPLACEMENT',
          replacementName: '', departureReason: '', dateRangeStart: '', dateRangeEnd: '',
          contractType: 'CDI', justification: '', jobCharacteristics: '',
          candidateEducation: '', candidateSkills: ''
        });
        setShowForm(false);
        fetchHiringRequests();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création de la demande');
      }
    } catch (error) {
      console.error('Error creating hiring request:', error);
      alert('Erreur lors de la création de la demande');
    }
  };

  const canCreateRequest = user?.role === 'CO' || user?.role === 'RH' || user?.role === 'Manager';
  const canViewAll = user?.role === 'RH';

  if (!isAuthenticated) return null;

  const departments = ['RH', 'Production', 'Méthode & Indus', 'Finance', 'supply chain', 'Maintenance', 'HSE', 'Qualité', 'groupe', 'achat'];
  const contractTypes = ['CDI', 'CDD', 'Stage', 'Intérim'];
  const personnelTypes = ['OUVRIER', 'ETAM', 'CADRE'];

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'VACANT': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'HIRED': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'COMPLETED': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'CANCELLED': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'SUSPENDED': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'VACANT': 'Vacant',
      'IN_PROGRESS': 'En cours',
      'HIRED': 'Embauché',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé',
      'SUSPENDED': 'Suspendu',
    };
    return statusMap[status] || status;
  };

  const getPersonnelTypeColor = (type?: string) => {
    switch (type) {
      case 'CADRE': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'ETAM': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl min-h-screen">
        <Breadcrumb pageName="Demandes d'Embauche" />

        {/* STATS HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Total Demandes</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stats.total}</h3>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-meta-4 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border-l-4 border-yellow-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">En Cours</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stats.active}</h3>
              </div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border-l-4 border-green-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Cloturées</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stats.completed}</h3>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border-l-4 border-red-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Critiques (&gt;30j)</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stats.urgent}</h3>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ACTION & FILTER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Rechercher par titre, département..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-strokedark bg-white dark:bg-meta-4 focus:ring-2 focus:ring-blue-500"
            />
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {canCreateRequest && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Demande
            </button>
          )}
        </div>

        {/* Modal Form */}
        {canCreateRequest && showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-2xl w-full max-w-4xl my-8">
              <div className="p-6 border-b border-gray-200 dark:border-strokedark flex justify-between items-center bg-gray-50 dark:bg-meta-4/30 rounded-t-xl">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Nouvelle Demande d'Embauche</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 max-h-[80vh] overflow-y-auto space-y-6">

                {/* Header: Date, Service, Location */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">DATE *</label>
                    <input type="date" name="requestDate" value={formData.requestDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service *</label>
                    <select name="service" value={formData.service} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="">Sélectionner</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lieu de Travail *</label>
                      <input type="text" name="workLocation" value={formData.workLocation} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Tunis" />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">BU</label>
                      <input type="text" name="businessUnit" value={formData.businessUnit} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="ex: TES" />
                    </div>
                  </div>
                </div>

                {/* Personnel Type Checkboxes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Catégorie *</label>
                  <div className="flex gap-6">
                    {personnelTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="personnelType"
                          value={type}
                          checked={formData.personnelType === type}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Title & Desired Date */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Libellé du Poste à Pourvoir *</label>
                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date souhaitée d'engagement *</label>
                    <input type="date" name="desiredHiringDate" value={formData.desiredHiringDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                {/* Reason Section */}
                <div className="border border-gray-200 dark:border-strokedark p-4 rounded-lg bg-gray-50 dark:bg-meta-4/10">
                  <label className="block text-sm font-bold text-gray-800 dark:text-white mb-3">Motif de la demande *</label>
                  <div className="space-y-4">
                    {/* Replacement */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input type="radio" name="reason" value="REPLACEMENT" checked={formData.reason === 'REPLACEMENT'} onChange={handleInputChange} />
                        En Remplacement de :
                      </label>
                      {formData.reason === 'REPLACEMENT' && (
                        <div className="ml-6 grid md:grid-cols-2 gap-4">
                          <input type="text" name="replacementName" value={formData.replacementName} onChange={handleInputChange} className="px-3 py-1 border border-gray-300 rounded w-full" placeholder="Nom du remplacé" />
                          <select name="departureReason" value={formData.departureReason} onChange={handleInputChange} className="px-3 py-1 border border-gray-300 rounded w-full">
                            <option value="">Motif de départ...</option>
                            <option value="DEMISSION">Démission</option>
                            <option value="MUTATION">Mutation</option>
                            <option value="LICENCIEMENT">Licenciement</option>
                            <option value="RETRAITE">Retraite</option>
                            <option value="AUTRE">Autre</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Budgeted Increase */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input type="radio" name="reason" value="BUDGETED_INCREASE" checked={formData.reason === 'BUDGETED_INCREASE'} onChange={handleInputChange} />
                        En Augmentation d'Effectif Budgété
                      </label>
                      {formData.reason === 'BUDGETED_INCREASE' && (
                        <div className="ml-6 flex items-center gap-2 text-sm flex-wrap">
                          <span>Préciser du</span>
                          <input type="date" name="dateRangeStart" value={formData.dateRangeStart} onChange={handleInputChange} className="px-2 py-1 border border-gray-300 rounded" />
                          <span>au</span>
                          <input type="date" name="dateRangeEnd" value={formData.dateRangeEnd} onChange={handleInputChange} className="px-2 py-1 border border-gray-300 rounded" />
                        </div>
                      )}
                    </div>

                    {/* Non Budgeted Increase */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="reason" value="NON_BUDGETED_INCREASE" checked={formData.reason === 'NON_BUDGETED_INCREASE'} onChange={handleInputChange} />
                        En Augmentation d'Effectif Non Budgété
                      </label>
                    </div>
                  </div>
                </div>

                {/* Contract Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type de Contrat *</label>
                  <div className="flex gap-6">
                    {['CDI', 'CDD'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contractType"
                          value={type}
                          checked={formData.contractType === type}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Justification & Characteristics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Justification précise de la demande *</label>
                    <textarea name="justification" value={formData.justification} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Caractéristiques du Poste à Pourvoir *</label>
                    <textarea name="jobCharacteristics" value={formData.jobCharacteristics} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                {/* Candidate Requirements */}
                <div className="space-y-4 border-t border-gray-200 dark:border-strokedark pt-4">
                  <h3 className="font-bold text-gray-800 dark:text-white">Caractéristiques requises du Candidat :</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">1. Formation souhaitée *</label>
                    <input type="text" name="candidateEducation" value={formData.candidateEducation} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Ingénieur, Technicien Supérieur..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">2. Connaissances / Compétences indispensables *</label>
                    <textarea name="candidateSkills" value={formData.candidateSkills} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-gray-200 dark:border-strokedark flex justify-end gap-3 bg-gray-50 dark:bg-meta-4/30 rounded-b-xl">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Soumettre
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ENHANCED LIST WITH ANIMATIONS */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4">Chargement des demandes...</p>
            </div>
          ) : hiringRequests.length === 0 ? (
            <div className="bg-white dark:bg-boxdark rounded-xl p-12 text-center text-gray-500 shadow-sm">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucune demande trouvée</p>
              <div className="mt-4">
                <button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline">Créer votre première demande</button>
              </div>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4"
            >
              {hiringRequests.map(req => (
                <motion.div
                  key={req._id || req.id}
                  variants={item}
                  className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-strokedark relative overflow-hidden group"
                >
                  {/* Status Stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(req.status).replace('bg-', 'bg-').split(' ')[0]}`}></div>

                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start pl-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                          {req.jobTitle}
                        </h3>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                          {getStatusLabel(req.status)}
                        </span>
                        {req.personnelType && (
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPersonnelTypeColor(req.personnelType)}`}>
                            {req.personnelType}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">#{req.id ? req.id.toString().padStart(4, '0') : (req._id ? req._id.toString().slice(-4) : '????')}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-8 text-sm text-slate-600 dark:text-slate-300 mt-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span>{req.service}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>
                            {req.candidates?.length ? (
                              <span className="text-blue-600 font-medium">{req.candidates.length} Candidats</span>
                            ) : 'Aucun candidat'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <span>{req.contractType || 'CDI'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{new Date(req.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      {/* Additional Detailed Info */}
                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-strokedark flex flex-wrap gap-4 text-xs">
                        <div className="bg-slate-50 dark:bg-meta-4 px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium text-slate-900 dark:text-white">{req.workLocation || 'Site Non spécifié'}</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-meta-4 px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <UserCheck className="w-3 h-3" />
                          <span className="font-medium text-slate-900 dark:text-white">Demandeur: {req.recruiter?.username || 'Système'}</span>
                        </div>
                        {req.desiredHiringDate && (
                          <div className="bg-slate-50 dark:bg-meta-4 px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3" />
                            <span className="font-medium text-slate-900 dark:text-white">
                              Pour le: {new Date(req.desiredHiringDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                        <div className="bg-slate-50 dark:bg-meta-4 px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 max-w-md truncate">
                          <span className="font-semibold text-slate-900 dark:text-white">Motif:</span> {req.justification}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors w-full justify-center">
                        Détails <ChevronRight className="w-4 h-4" />
                      </button>
                      {canCreateRequest && (
                        <button className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline">
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HiringRequestsPage;
