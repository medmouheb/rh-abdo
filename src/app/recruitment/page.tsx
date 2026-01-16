"use client";

import React, { useState } from 'react';
import { Bell, FileText, User as UserIcon, Calendar, Users, Briefcase } from 'lucide-react';
import {
    users,
    candidateStatuses,
    positionStatuses as jobRequestStatuses,
    candidates as initialCandidates,
    jobRequests as initialJobRequests,
    interviews as initialInterviews
} from '@/types/recruitment';
import type {
    User,
    JobRequest,
    Candidate,
    Interview,
    InterviewType,
    PositionStatus,
    CandidateStatus
} from '@/types/recruitment';
import RecruitmentKPIDashboard from './kpi/page';

// Helper to format dates
const formatDate = (date: Date | string) => {
    if (!date) return '';
    return new Date(date).toLocaleString('fr-FR');
};

// Colors mapping for statuses
const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        'Nouveau': 'bg-gray-100 text-gray-700',
        'Traitement de dossier': 'bg-blue-100 text-blue-700',
        'Entretien RH': 'bg-purple-100 text-purple-700',
        'Entretien Technique': 'bg-indigo-100 text-indigo-700',
        'Entretien Manager': 'bg-cyan-100 text-cyan-700',
        'Entretien Final': 'bg-pink-100 text-pink-700',
        'En attente de décision': 'bg-yellow-100 text-yellow-700',
        'Offre envoyée': 'bg-orange-100 text-orange-700',
        'Embauché': 'bg-green-100 text-green-700',
        'Refus candidat': 'bg-red-100 text-red-700',
        'Refus entreprise': 'bg-red-100 text-red-700',
        'stand by': 'bg-gray-100 text-gray-700',
        'Vacant': 'bg-gray-100 text-gray-700',
        'En cours': 'bg-blue-100 text-blue-700',
        'En cours de traitement': 'bg-blue-100 text-blue-700',
        'Suspendu': 'bg-yellow-100 text-yellow-700',
        'Annulé': 'bg-red-100 text-red-700',
        'Terminé': 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
};

const interviewTypes: InterviewType[] = ['Entretien RH', 'Entretien Technique', 'Entretien Manager', 'Entretien Final'];

const RecruitmentDashboard = () => {
    const [currentUser, setCurrentUser] = useState<User>(users[0]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notifications, setNotifications] = useState<any[]>([]);

    // Using imported sample data as initial state
    const [jobRequests, setJobRequests] = useState<JobRequest[]>(initialJobRequests);
    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
    const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);

    const [showModal, setShowModal] = useState<'updateCandidate' | 'updateJobRequest' | 'scheduleInterview' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Form states for Interview Modal
    const [interviewForm, setInterviewForm] = useState({
        type: interviewTypes[0],
        date: '',
        location: ''
    });

    const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;

    const handleUpdateCandidateStatus = (candidateId: string, newStatus: CandidateStatus) => {
        setCandidates(prev => prev.map(c =>
            c.id === candidateId ? { ...c, status: newStatus } : c
        ));

        const candidate = candidates.find(c => c.id === candidateId);
        const rhUsers = users.filter((u: User) => u.role === 'RH');

        rhUsers.forEach((rh: User) => {
            if (rh.id !== currentUser.id) {
                setNotifications(prev => [...prev, {
                    id: `notif-${Date.now()}-${rh.id}`,
                    userId: rh.id,
                    type: 'status_change',
                    title: 'Changement de statut candidat',
                    message: `${candidate?.name} est maintenant en "${newStatus}"`,
                    isRead: false,
                    createdAt: new Date()
                }]);
            }
        });

        setShowModal(null);
    };

    const handleUpdateJobRequestStatus = (requestId: string, newStatus: PositionStatus) => {
        const request = jobRequests.find(r => r.id === requestId);
        if (!request) return;

        setJobRequests(prev => prev.map(r =>
            r.id === requestId ? { ...r, status: newStatus } : r
        ));

        setNotifications(prev => [...prev, {
            id: `notif-${Date.now()}`,
            userId: request.createdBy,
            type: 'position_update',
            title: 'Mise à jour de demande',
            message: `Votre demande "${request.jobTitle}" est maintenant "${newStatus}"`,
            isRead: false,
            createdAt: new Date()
        }]);

        setShowModal(null);
    };

    const handleScheduleInterview = () => {
        if (!selectedItem) return;

        const candidate = candidates.find(c => c.id === selectedItem.id);
        if (!candidate) return;

        const newInterview: Interview = {
            id: `int-${Date.now()}`,
            candidateId: candidate.id,
            candidateName: candidate.name,
            type: interviewForm.type,
            scheduledDate: new Date(interviewForm.date),
            duration: 60, // Default duration
            location: interviewForm.location || 'Salle 1',
            interviewers: [currentUser.id],
            status: 'Planifié',
            createdBy: currentUser.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setInterviews(prev => [...prev, newInterview]);

        setCandidates(prev => prev.map(c =>
            c.id === candidate.id ? { ...c, status: interviewForm.type as CandidateStatus } : c
        ));

        const rhUsers = users.filter((u: User) => u.role === 'RH');
        rhUsers.forEach((rh: User) => {
            setNotifications(prev => [...prev, {
                id: `notif-${Date.now()}-${rh.id}`,
                userId: rh.id,
                type: 'interview_scheduled',
                title: 'Entretien planifié',
                message: `${interviewForm.type} planifié avec ${candidate.name}`,
                isRead: false,
                createdAt: new Date()
            }]);
        });

        setShowModal(null);
        setInterviewForm({ type: interviewTypes[0], date: '', location: '' }); // Reset form
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-boxdark-2 dark:to-boxdark">
            <header className="bg-white dark:bg-boxdark shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Système de Recrutement</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gestion complète du recrutement</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <select
                                value={currentUser.id}
                                onChange={(e) => {
                                    const user = users.find((u: User) => u.id === e.target.value);
                                    if (user) setCurrentUser(user);
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-strokedark rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-boxdark text-gray-800 dark:text-white"
                            >
                                {users.map((u: User) => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>

                            <div className="relative">
                                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-strokedark rounded-lg">
                                    <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-meta-4/30 rounded-lg">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{currentUser.name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{currentUser.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white dark:bg-boxdark rounded-lg shadow-md mb-6">
                    <div className="flex border-b border-stroke dark:border-strokedark">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'dashboard'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'
                                }`}
                        >
                            <Briefcase className="w-5 h-5 inline mr-2" />
                            Tableau de Bord
                        </button>
                        <button
                            onClick={() => setActiveTab('demandes')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'demandes'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'
                                }`}
                        >
                            <FileText className="w-5 h-5 inline mr-2" />
                            Demandes d'Embauche
                        </button>
                        <button
                            onClick={() => setActiveTab('candidats')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'candidats'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'
                                }`}
                        >
                            <Users className="w-5 h-5 inline mr-2" />
                            Candidats
                        </button>
                        <button
                            onClick={() => setActiveTab('entretiens')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'entretiens'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'
                                }`}
                        >
                            <Calendar className="w-5 h-5 inline mr-2" />
                            Entretiens
                        </button>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <RecruitmentKPIDashboard />
                )}

                {activeTab === 'demandes' && (
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <h2 className="text-2xl font-bold">Demandes d'Embauche</h2>
                        </div>
                        <div className="divide-y divide-stroke dark:divide-strokedark">
                            {jobRequests.filter(r => currentUser.role === 'RH' || r.createdBy === currentUser.id).map(req => (
                                <div key={req.id} className="p-6 hover:bg-gray-50 dark:hover:bg-meta-4/20 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-black dark:text-white">{req.jobTitle}</h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Département: {req.department}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">Créé le: {formatDate(req.createdAt)}</p>
                                        </div>
                                        {currentUser.role === 'RH' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(req);
                                                    setShowModal('updateJobRequest');
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Mettre à jour
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {jobRequests.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    Aucune demande d'embauche disponible.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'candidats' && (
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <h2 className="text-2xl font-bold">Candidats</h2>
                        </div>
                        <div className="divide-y divide-stroke dark:divide-strokedark">
                            {candidates.map(candidate => (
                                <div key={candidate.id} className="p-6 hover:bg-gray-50 dark:hover:bg-meta-4/20 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-black dark:text-white">{candidate.name}</h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                                                    {candidate.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Niveau: {candidate.educationLevel}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">Département: {candidate.department}</p>
                                        </div>
                                        {(currentUser.role === 'RH' || currentUser.role === 'Manager') && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(candidate);
                                                        setShowModal('updateCandidate');
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    Changer statut
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(candidate);
                                                        setShowModal('scheduleInterview');
                                                    }}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Planifier entretien
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {candidates.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    Aucun candidat trouvé.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'entretiens' && (
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
                            <h2 className="text-2xl font-bold">Entretiens Planifiés</h2>
                        </div>
                        <div className="divide-y divide-stroke dark:divide-strokedark">
                            {interviews.map(interview => (
                                <div key={interview.id} className="p-6 hover:bg-gray-50 dark:hover:bg-meta-4/20 transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-black dark:text-white">{interview.candidateName}</h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.type)}`}>
                                                    {interview.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                {formatDate(interview.scheduledDate)}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">Lieu: {interview.location}</p>
                                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(interview.status)}`}>
                                                {interview.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {interviews.length === 0 && (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    Aucun entretien planifié.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModal === 'updateCandidate' && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-boxdark rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Changer le statut de {selectedItem.name}</h3>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {candidateStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleUpdateCandidateStatus(selectedItem.id, status)}
                                    className={`w-full text-left px-4 py-2 rounded-lg hover:opacity-80 transition ${getStatusColor(status)}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(null)}
                            className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-strokedark text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-opacity-80 transition"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {showModal === 'updateJobRequest' && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-boxdark rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Changer le statut de la demande</h3>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                            {jobRequestStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleUpdateJobRequestStatus(selectedItem.id, status)}
                                    className={`w-full text-left px-4 py-2 rounded-lg hover:opacity-80 transition ${getStatusColor(status)}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(null)}
                            className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-strokedark text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-opacity-80 transition"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {showModal === 'scheduleInterview' && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-boxdark rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Planifier un entretien pour {selectedItem.name}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Type d'entretien</label>
                                <select
                                    value={interviewForm.type}
                                    onChange={(e) => setInterviewForm(prev => ({ ...prev, type: e.target.value as InterviewType }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-strokedark rounded-lg bg-white dark:bg-meta-4 text-black dark:text-white"
                                >
                                    {interviewTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Date et heure</label>
                                <input
                                    type="datetime-local"
                                    value={interviewForm.date}
                                    onChange={(e) => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-strokedark rounded-lg bg-white dark:bg-meta-4 text-black dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Lieu</label>
                                <input
                                    type="text"
                                    value={interviewForm.location}
                                    onChange={(e) => setInterviewForm(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-strokedark rounded-lg bg-white dark:bg-meta-4 text-black dark:text-white"
                                    placeholder="Salle A, En ligne, etc."
                                />
                            </div>
                            <button
                                onClick={handleScheduleInterview}
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                disabled={!interviewForm.date || !interviewForm.location}
                            >
                                Planifier
                            </button>
                        </div>
                        <button
                            onClick={() => setShowModal(null)}
                            className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-strokedark text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-opacity-80 transition"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruitmentDashboard;
