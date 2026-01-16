"use client";

import React, { useState } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PlusCircle, Search, Edit2, Trash2, Power, Mail, Phone, Shield, User } from 'lucide-react';

const initialUsers = [
    { id: 'user-1', name: 'SAADANI HIBA', email: 'hiba@company.com', role: 'RH', department: 'RH', phone: '+216 98 123 456', isActive: true },
    { id: 'user-2', name: 'MOHAMED AYMEN', email: 'aymen@company.com', role: 'Manager', department: 'Production', phone: '+216 98 234 567', isActive: true },
    { id: 'user-3', name: 'Zoubaier Berrebeh', email: 'zoubaier@company.com', role: 'CO', department: 'Méthode & Indus', phone: '+216 98 345 678', isActive: true },
    { id: 'user-4', name: 'Ahmed Ben Ali', email: 'ahmed@company.com', role: 'CO', department: 'Finance', phone: '+216 98 456 789', isActive: true },
    { id: 'user-5', name: 'Leila Mansouri', email: 'leila@company.com', role: 'Manager', department: 'Qualité', phone: '+216 98 567 890', isActive: true },
    { id: 'user-6', name: 'Karim Trabelsi', email: 'karim@company.com', role: 'Direction', department: 'Direction Générale', phone: '+216 98 678 901', isActive: true },
];

const departments = ['RH', 'Production', 'Méthode & Indus', 'Finance', 'Maintenance', 'HSE', 'Qualité', 'Direction Générale'];
const roles = ['RH', 'Manager', 'CO', 'Direction'];

export default function UsersPage() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userForm, setUserForm] = useState({
        name: '', email: '', role: '', department: '', phone: '', isActive: true
    });

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            'RH': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
            'Manager': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
            'CO': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
            'Direction': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
        };
        return colors[role] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    };

    const handleCreateUser = () => {
        if (!userForm.name || !userForm.email || !userForm.role) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        const newUser = {
            id: `user-${Date.now()}`,
            ...userForm,
        };

        setUsers([...users, newUser]);
        setShowModal(null);
        setUserForm({ name: '', email: '', role: '', department: '', phone: '', isActive: true });
    };

    const handleUpdateUser = () => {
        if (!userForm.name || !userForm.email || !userForm.role) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setUsers(users.map(u =>
            u.id === selectedUser.id ? { ...u, ...userForm } : u
        ));

        setShowModal(null);
        setSelectedUser(null);
        setUserForm({ name: '', email: '', role: '', department: '', phone: '', isActive: true });
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const handleToggleUserStatus = (userId: string) => {
        setUsers(users.map(u =>
            u.id === userId ? { ...u, isActive: !u.isActive } : u
        ));
    };

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setUserForm({
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department || '',
            phone: user.phone || '',
            isActive: user.isActive
        });
        setShowModal('editUser');
    };

    const openCreateModal = () => {
        setUserForm({ name: '', email: '', role: '', department: '', phone: '', isActive: true });
        setShowModal('createUser');
    };

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Utilisateurs" />

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-wrap items-center justify-between p-6 gap-4 border-b border-stroke dark:border-strokedark">
                    <h2 className="text-xl font-bold text-black dark:text-white">
                        Liste des Utilisateurs
                    </h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stroke bg-transparent outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                            />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Nouveau
                        </button>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                    Nom
                                </th>
                                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                                    Email / Tél
                                </th>
                                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                    Rôle
                                </th>
                                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                    Département
                                </th>
                                <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white text-center">
                                    Statut
                                </th>
                                <th className="px-4 py-4 font-medium text-black dark:text-white text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className={!user.isActive ? 'opacity-60' : ''}>
                                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 dark:bg-meta-4 rounded-full">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <h5 className="font-medium text-black dark:text-white">
                                                {user.name}
                                            </h5>
                                        </div>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center text-sm gap-2 text-gray-600 dark:text-gray-400">
                                                <Mail className="w-3.5 h-3.5" />
                                                {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center text-sm gap-2 text-gray-500">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{user.department}</p>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                                        <button
                                            onClick={() => handleToggleUserStatus(user.id)}
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${user.isActive
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                                                }`}
                                            title="Basculer le statut"
                                        >
                                            {user.isActive ? 'Actif' : 'Inactif'}
                                        </button>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <div className="flex items-center justify-center space-x-3.5">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="hover:text-primary transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleUserStatus(user.id)}
                                                className="hover:text-yellow-500 transition-colors"
                                                title={user.isActive ? "Désactiver" : "Activer"}
                                            >
                                                <Power className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="hover:text-red-500 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {(showModal === 'createUser' || showModal === 'editUser') && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-stroke dark:border-strokedark">
                            <h3 className="text-xl font-semibold text-black dark:text-white">
                                {showModal === 'createUser' ? 'Créer un Utilisateur' : 'Modifier l\'Utilisateur'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Nom Complet *
                                    </label>
                                    <input
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded border border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                        placeholder="Jean Dupont"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded border border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                        placeholder="jean.dupont@company.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Rôle *
                                    </label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                        className="w-full px-4 py-3 rounded border border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Département
                                    </label>
                                    <select
                                        value={userForm.department}
                                        onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                                        className="w-full px-4 py-3 rounded border border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                    >
                                        <option value="">Sélectionner un département</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={userForm.phone}
                                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded border border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                                    placeholder="+216 98 123 456"
                                />
                            </div>

                            {showModal === 'editUser' && (
                                <div className="flex items-center gap-3 mt-4">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={userForm.isActive}
                                        onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                                        className="w-5 h-5 text-primary rounded border-stroke"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-black dark:text-white">
                                        Compte actif
                                    </label>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-stroke dark:border-strokedark">
                                <button
                                    onClick={() => {
                                        setShowModal(null);
                                        setSelectedUser(null);
                                        setUserForm({ name: '', email: '', role: '', department: '', phone: '', isActive: true });
                                    }}
                                    className="px-6 py-2.5 rounded border border-stroke text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={showModal === 'createUser' ? handleCreateUser : handleUpdateUser}
                                    className="px-6 py-2.5 rounded bg-primary text-white hover:bg-opacity-90 transition-colors"
                                >
                                    {showModal === 'createUser' ? 'Créer' : 'Enregistrer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
