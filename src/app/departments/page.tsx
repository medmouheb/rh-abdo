"use client";

import React, { useState, useMemo } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Building2, Users, DollarSign, Briefcase, User, ArrowLeft, Eye, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';

const DepartmentsPage = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

    const employees = [
        { id: '1', name: 'Sarah Mansour', department: 'RH', position: 'Chargée RH', site: 'TT', salary: 2400, hiredDate: '2024-02-01', status: 'Actif', phone: '+216 98 111 111', email: 'sarah@company.com' },
        { id: '2', name: 'Leila Ayari', department: 'RH', position: 'Chargée RH', site: 'TT', salary: 2800, hiredDate: '2024-03-01', status: 'Actif', phone: '+216 98 222 222', email: 'leila@company.com' },
        { id: '3', name: 'Omar Dridi', department: 'Production', position: 'Chef équipe', site: 'TTG', salary: 3200, hiredDate: '2024-02-05', status: 'Actif', phone: '+216 98 333 333', email: 'omar@company.com' },
        { id: '4', name: 'Ahmed Slim', department: 'Production', position: 'Chef équipe', site: 'TTG', salary: 2900, hiredDate: '2024-03-10', status: 'Actif', phone: '+216 98 444 444', email: 'ahmed@company.com' },
        { id: '5', name: 'Yassine Ghorbel', department: 'Finance', position: 'Comptable', site: 'TT', salary: 3500, hiredDate: '2024-02-10', status: 'Actif', phone: '+216 98 555 555', email: 'yassine@company.com' },
        { id: '6', name: 'Walid Jendoubi', department: 'Maintenance', position: 'Technicien', site: 'TTG', salary: 2600, hiredDate: '2024-02-18', status: 'Actif', phone: '+216 98 666 666', email: 'walid@company.com' },
        { id: '7', name: 'Sonia Kasraoui', department: 'Finance', position: 'Comptable', site: 'TT', salary: 3200, hiredDate: '2023-12-15', status: 'Actif', phone: '+216 98 777 777', email: 'sonia@company.com' },
        { id: '8', name: 'Ines Ben Amor', department: 'Qualité', position: 'Ingénieur Qualité', site: 'TT', salary: 3800, hiredDate: '2023-11-20', status: 'Actif', phone: '+216 98 888 888', email: 'ines@company.com' },
    ];

    const vacantPositions = [
        { id: '1', jobTitle: 'Chargé de Recrutement', department: 'RH', site: 'TT', budget: 2500, status: 'Vacant', postedDate: '2025-01-10' },
        { id: '2', jobTitle: 'Chef d\'équipe', department: 'Production', site: 'TTG', budget: 3000, status: 'En cours', postedDate: '2025-01-05' },
        { id: '3', jobTitle: 'Ingénieur Qualité', department: 'Qualité', site: 'TT', budget: 4000, status: 'Vacant', postedDate: '2025-01-12' },
        { id: '4', jobTitle: 'Comptable', department: 'Finance', site: 'TT', budget: 3200, status: 'En cours', postedDate: '2025-01-08' },
        { id: '5', name: 'Technicien Maintenance', department: 'Maintenance', site: 'TTG', budget: 2800, status: 'Vacant', postedDate: '2025-01-15' },
    ];

    const managers = [
        { department: 'RH', name: 'SAADANI HIBA', email: 'hiba@company.com', phone: '+216 98 100 100' },
        { department: 'Production', name: 'MOHAMED AYMEN', email: 'aymen@company.com', phone: '+216 98 200 200' },
        { department: 'Finance', name: 'Ahmed Ben Ali', email: 'ahmed.ali@company.com', phone: '+216 98 300 300' },
        { department: 'Maintenance', name: 'Karim Trabelsi', email: 'karim@company.com', phone: '+216 98 400 400' },
        { department: 'Qualité', name: 'Leila Mansouri', email: 'leila.m@company.com', phone: '+216 98 500 500' },
    ];

    const departmentBudgets: { [key: string]: number } = {
        'RH': 15000,
        'Production': 25000,
        'Finance': 20000,
        'Maintenance': 18000,
        'Qualité': 22000,
        'HSE': 16000,
    };

    const departments = Object.keys(departmentBudgets);

    const departmentStats = useMemo(() => {
        return departments.map(dept => {
            const deptEmployees = employees.filter(e => e.department === dept);
            const deptVacantPos = vacantPositions.filter(p => p.department === dept);
            const manager = managers.find(m => m.department === dept);

            const totalSalaries = deptEmployees.reduce((sum, e) => sum + e.salary, 0);
            const avgSalary = deptEmployees.length > 0 ? totalSalaries / deptEmployees.length : 0;

            const ttEmployees = deptEmployees.filter(e => e.site === 'TT').length;
            const ttgEmployees = deptEmployees.filter(e => e.site === 'TTG').length;

            return {
                department: dept,
                effectif: deptEmployees.length,
                manager: manager?.name || '-',
                budget: departmentBudgets[dept] || 0,
                vacantPositions: deptVacantPos.length,
                totalSalaries,
                avgSalary,
                employees: deptEmployees,
                vacantPos: deptVacantPos,
                managerInfo: manager,
                sites: { TT: ttEmployees, TTG: ttgEmployees }
            };
        }).filter(d => d.effectif > 0 || d.vacantPositions > 0);
    }, [employees, vacantPositions]);

    const selectedDeptData = selectedDepartment
        ? departmentStats.find(d => d.department === selectedDepartment)
        : null;

    if (selectedDepartment && selectedDeptData) {
        return (
            <div className="mx-auto max-w-7xl">
                <Breadcrumb pageName={`Département ${selectedDeptData.department}`} />

                <div className="space-y-6">
                    {/* Header avec retour */}
                    <button
                        onClick={() => setSelectedDepartment(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-boxdark rounded-lg shadow hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors text-black dark:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Retour aux départements</span>
                    </button>

                    {/* En-tête du département */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Département {selectedDeptData.department}</h1>
                                <p className="text-blue-100">Vue détaillée complète</p>
                            </div>
                            <Building2 className="w-16 h-16 opacity-30" />
                        </div>
                    </div>

                    {/* Stats principales */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Effectif Total</p>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedDeptData.effectif}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">TT: {selectedDeptData.sites.TT} | TTG: {selectedDeptData.sites.TTG}</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget Total</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedDeptData.budget.toLocaleString()}€</p>
                                </div>
                                <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Postes Vacants</p>
                                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{selectedDeptData.vacantPositions}</p>
                                </div>
                                <Briefcase className="w-12 h-12 text-orange-500 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Salaire Moyen</p>
                                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.round(selectedDeptData.avgSalary).toLocaleString()}€</p>
                                </div>
                                <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Responsable du département */}
                    {selectedDeptData.managerInfo && (
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                Responsable du Département
                            </h2>
                            <div className="flex items-center gap-6 p-4 bg-blue-50 dark:bg-meta-4 rounded-lg">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedDeptData.managerInfo.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedDeptData.managerInfo.name}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {selectedDeptData.managerInfo.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {selectedDeptData.managerInfo.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des employés */}
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Users className="w-7 h-7" />
                                Effectif du Département ({selectedDeptData.effectif})
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-meta-4">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Nom</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Poste</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Site</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Salaire</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Date d'embauche</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Contact</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-strokedark">
                                    {selectedDeptData.employees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-meta-4/20">
                                            <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{emp.name}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{emp.position}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                                                    <MapPin className="w-3 h-3" />
                                                    {emp.site}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
                                                {emp.salary.toLocaleString()}€
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{emp.hiredDate}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <Mail className="w-3 h-3" />
                                                        {emp.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {emp.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                                                    {emp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-100 dark:bg-meta-4">
                                    <tr className="font-bold">
                                        <td colSpan={3} className="px-6 py-4 text-gray-800 dark:text-white">TOTAL SALAIRES</td>
                                        <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 text-lg">
                                            {selectedDeptData.totalSalaries.toLocaleString()}€
                                        </td>
                                        <td colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Postes vacants */}
                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Briefcase className="w-7 h-7" />
                                Postes Vacants ({selectedDeptData.vacantPositions})
                            </h2>
                        </div>
                        <div className="p-6">
                            {selectedDeptData.vacantPos.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Aucun poste vacant</p>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {selectedDeptData.vacantPos.map(pos => (
                                        <div key={pos.id} className="border-2 border-gray-200 dark:border-strokedark rounded-lg p-6 hover:border-orange-500 transition-colors bg-white dark:bg-boxdark">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{pos.jobTitle}</h3>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${pos.status === 'Vacant' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
                                                    }`}>
                                                    {pos.status}
                                                </span>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Site: <span className="font-semibold">{pos.site}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>Budget: <span className="font-bold text-green-600 dark:text-green-400">{pos.budget.toLocaleString()}€</span></span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                    Publié le: {pos.postedDate}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Départements" />

            <div className="space-y-6">
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Vue d'ensemble des Départements</h1>
                            <p className="text-gray-600 dark:text-gray-400">Cliquez sur un département pour voir les détails</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Département</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Effectif</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase">Responsable</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold uppercase">Budget</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Postes Vacants</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold uppercase">Total Salaires</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-strokedark">
                                {departmentStats.map(dept => (
                                    <tr key={dept.department} className="hover:bg-gray-50 dark:hover:bg-meta-4/20">
                                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white text-lg">{dept.department}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-full font-bold text-lg">
                                                {dept.effectif}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">{dept.manager}</td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400 text-lg">
                                            {dept.budget.toLocaleString()}€
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 rounded-full font-bold">
                                                {dept.vacantPositions}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-purple-600 dark:text-purple-400 text-lg">
                                            {dept.totalSalaries.toLocaleString()}€
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedDepartment(dept.department)}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                            >
                                                <Eye className="w-5 h-5" />
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentsPage;
