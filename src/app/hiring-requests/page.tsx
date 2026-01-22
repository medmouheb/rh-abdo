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
  id: number;
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
  comments?: string;
  validationRHStatus?: string;
  validationPlantManagerStatus?: string;
  validationRecruitmentStatus?: string;
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
    jobTitle: '',
    service: '',
    justification: '',
    workLocation: '',
    contractType: '',
    personnelType: 'CADRE',
    candidateEducation: '',
    candidateSkills: '',
  });

  const [selectedRequest, setSelectedRequest] = useState<HiringRequest | null>(null);
  const [refusalReason, setRefusalReason] = useState('');
  const [showRefusalInput, setShowRefusalInput] = useState(false);

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selectedRequest) return;

    if (action === 'reject' && !showRefusalInput) {
      setShowRefusalInput(true);
      return;
    }

    if (action === 'reject' && !refusalReason.trim()) {
      alert("Veuillez indiquer le motif du refus.");
      return;
    }

    try {
      const payload: any = {
        status: action === 'approve' ? 'VACANT' : 'CANCELLED',
        comments: action === 'approve'
          ? `VALIDÉ par ${user?.username || 'RH'}: Demande validée par RH.`
          : `REFUSÉ par ${user?.username || 'RH'}: ${refusalReason}`
      };

      const response = await apiRequest(`/api/hiring-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`Demande ${action === 'approve' ? 'validée' : 'refusée'} avec succès.`);
        setSelectedRequest(null);
        setRefusalReason('');
        setShowRefusalInput(false);
        fetchHiringRequests();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur technique lors de l'opération.");
    }
  };

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
        const data = await response.json();
        setHiringRequests(data);
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
    if (!formData.jobTitle || !formData.service || !formData.justification) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const response = await apiRequest('/api/hiring-request', {
        method: 'POST',
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          service: formData.service,
          workLocation: formData.workLocation || 'TT',
          contractType: formData.contractType || 'CDI',
          personnelType: formData.personnelType,
          justification: formData.justification,
          jobCharacteristics: formData.candidateSkills || '',
          candidateEducation: formData.candidateEducation || '',
          candidateSkills: formData.candidateSkills || '',
          reason: 'REPLACEMENT',
        }),
      });

      if (response.ok) {
        alert('Demande d\'embauche créée avec succès!');
        setFormData({
          jobTitle: '', service: '', justification: '', workLocation: '',
          contractType: '', personnelType: 'CADRE', candidateEducation: '', candidateSkills: '',
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

              <div className="p-8 max-h-[80vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Titre du Poste *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Ingénieur Qualité"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Département *</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Site</label>
                    <input
                      type="text"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="TT, TTG..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type Contrat</label>
                    <select
                      name="contractType"
                      value={formData.contractType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner</option>
                      {contractTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Justification *</label>
                    <textarea
                      name="justification"
                      value={formData.justification}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Raison du recrutement..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Compétences Requises</label>
                    <textarea
                      name="candidateSkills"
                      value={formData.candidateSkills}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Compétences techniques et soft skills..."
                    />
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

        {/* DETAILS & REVIEW MODAL */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-2xl w-full max-w-2xl my-8 border border-gray-200 dark:border-strokedark">
              <div className="p-6 border-b border-gray-200 dark:border-strokedark flex justify-between items-center bg-gray-50 dark:bg-meta-4/30 rounded-t-xl">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selectedRequest.jobTitle}</h2>
                  <p className="text-sm text-gray-500">{selectedRequest.service} • {new Date(selectedRequest.createdAt).toLocaleDateString()} </p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-500 hover:text-red-500 bg-gray-100 p-2 rounded-full transition hover:bg-red-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 dark:bg-meta-4 p-4 rounded-lg">
                    <strong className="block text-gray-500 mb-1">Demandeur</strong>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedRequest.recruiter?.username || 'N/A'} ({selectedRequest.recruiter?.role})</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-meta-4 p-4 rounded-lg">
                    <strong className="block text-gray-500 mb-1">Type de Contrat</strong>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedRequest.contractType}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-meta-4 p-4 rounded-lg">
                    <strong className="block text-gray-500 mb-1">Date Souhaitée</strong>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {selectedRequest.desiredHiringDate ? new Date(selectedRequest.desiredHiringDate).toLocaleDateString() : 'Non spécifiée'}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-meta-4 p-4 rounded-lg">
                    <strong className="block text-gray-500 mb-1">Lieu de Travail</strong>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedRequest.workLocation || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" /> Justification
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-meta-4/50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100 dark:border-strokedark">
                    {selectedRequest.justification}
                  </p>
                </div>

                {/* Display Decision/Comments if available */}
                {selectedRequest.comments && (
                  <div className={`p-4 rounded-lg border ${selectedRequest.comments.startsWith('REFUSÉ') ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'}`}>
                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${selectedRequest.comments.startsWith('REFUSÉ') ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedRequest.comments.startsWith('REFUSÉ') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      Décision RH
                    </h4>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {selectedRequest.comments}
                    </p>
                  </div>
                )}

                {showRefusalInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30"
                  >
                    <h4 className="font-semibold text-red-600 mb-2">Motif du refus (Obligatoire)</h4>
                    <textarea
                      value={refusalReason}
                      onChange={(e) => setRefusalReason(e.target.value)}
                      className="w-full p-3 border border-red-200 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="Pourquoi refusez-vous cette demande ?"
                      rows={3}
                      autoFocus
                    />
                  </motion.div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-strokedark flex justify-end gap-3 bg-gray-50 dark:bg-meta-4/30 rounded-b-xl">
                {/* Only RH Actions */}
                {user?.role === 'RH' && selectedRequest.status !== 'CANCELLED' && selectedRequest.status !== 'HIRED' && (
                  <>
                    <button
                      onClick={() => handleReview('reject')}
                      className="px-5 py-2.5 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      {showRefusalInput ? 'Confirmer le Refus' : 'Refuser'}
                    </button>
                    {!showRefusalInput && (
                      <button
                        onClick={() => handleReview('approve')}
                        className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Accepter & Valider
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Fermer
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
                  key={req.id}
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
                        <span className="text-xs text-slate-400">#{req.id.toString().padStart(4, '0')}</span>
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
                      <button
                        onClick={() => { setSelectedRequest(req); setShowRefusalInput(false); setRefusalReason(''); }}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors w-full justify-center"
                      >
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
