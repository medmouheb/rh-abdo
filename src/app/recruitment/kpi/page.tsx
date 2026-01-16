"use client";

import React, { useEffect, useState } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getKPIDashboardData } from "@/app/actions/kpi";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, Clock, Briefcase, Filter, PieChart as PieChartIcon, Activity, MapPin, TrendingUp, Users } from 'lucide-react';

// Colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const PIPELINE_COLORS = [
    '#374151', '#2563EB', '#8B5CF6', '#EF4444', '#F59E0B',
    '#3B82F6', '#10B981', '#84CC16', '#10B981',
];

interface DashboardData {
    pipelineData: any[];
    sourceData: any[];
    modeData: any[];
    financials: {
        totalCost: number;
        costPerHire: number;
        avgDaysToHire: number;
        activeVacancies: number;
    };
    decisionData: any[];
    monthlyData: any[];
    departmentGenderData: any[];
    detailedStats: any[];
    recentActivity: any[];
}

export default function KPIDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const stats = await getKPIDashboardData(selectedYear);
                setData(stats);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [selectedYear]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!data) return <div>Erreur de chargement des données.</div>;

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 bg-slate-50 dark:bg-boxdark-2 min-h-screen">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-strokedark">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Postes Vacants Actifs</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">{data.financials.activeVacancies}</h3>
                        </div>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-strokedark">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Coût Recrutement (YTD)</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
                                {data.financials.totalCost.toLocaleString()} <span className="text-sm font-normal text-slate-400">TND</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-strokedark">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Coût par Embauche</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
                                {Math.round(data.financials.costPerHire).toLocaleString()} <span className="text-sm font-normal text-slate-400">TND</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-boxdark rounded-xl p-6 shadow-sm border border-slate-100 dark:border-strokedark">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Délai Moyen</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
                                {data.financials.avgDaysToHire} <span className="text-sm font-normal text-slate-400">Jours</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* 1. Demandes d'Emploi par Site & Mois */}
                <div className="xl:col-span-2 bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-meta-4 rounded-lg">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Demandes d'Emploi par Site</h3>
                        </div>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>
                            <option value={2026}>2026</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#F1F5F9' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="TT" stackId="a" fill="#3B82F6" name="Site TT" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="TTG" stackId="a" fill="#8B5CF6" name="Site TTG" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Autre" stackId="a" fill="#CBD5E1" name="Autre" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Sources de Demande */}
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Sources de Candidature</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* 3. Candidats par Département & Genre */}
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Candidats par Département & Genre</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.departmentGenderData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="department" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="Homme" fill="#3B82F6" name="Hommes" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="Femme" fill="#EC4899" name="Femmes" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Pipeline de Recrutement */}
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Pipeline de Recrutement</h3>
                    <div className="space-y-4 overflow-y-auto max-h-80 pr-2">
                        {data.pipelineData.map((stage, index) => (
                            <div key={stage.name} className="relative">
                                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                                    <span>{stage.name}</span>
                                    <span>{stage.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${Math.min(stage.count * 10 + 5, 100)}%`,
                                            backgroundColor: PIPELINE_COLORS[index % PIPELINE_COLORS.length]
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Stats & Recent Activity Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Detailed Department Performance Table */}
                <div className="xl:col-span-2 bg-white dark:bg-boxdark rounded-xl shadow-lg p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Détails & Performance par Département</h3>
                            <p className="text-sm text-slate-500">Vue détaillée des demandes et recrutements</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Exporter CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-strokedark text-xs uppercase text-slate-500 dark:text-slate-400">
                                    <th className="py-3 px-2 font-semibold">Département</th>
                                    <th className="py-3 px-2 font-semibold text-center">Demandes</th>
                                    <th className="py-3 px-2 font-semibold text-center">Postes Vacants</th>
                                    <th className="py-3 px-2 font-semibold text-center">Candidats</th>
                                    <th className="py-3 px-2 font-semibold text-center">Embauchés</th>
                                    <th className="py-3 px-2 font-semibold text-center">Taux Conv.</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data.detailedStats.map((dept, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 dark:border-strokedark last:border-0 hover:bg-slate-50 dark:hover:bg-meta-4/10">
                                        <td className="py-3 px-2 font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                            <div className="w-2 h-8 rounded-full bg-blue-500" style={{ opacity: 1 - (idx * 0.1) }}></div>
                                            {dept.department}
                                        </td>
                                        <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                                            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-bold">{dept.totalRequests}</span>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            {dept.activeVacancies > 0 ? (
                                                <span className="text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-md">{dept.activeVacancies}</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">{dept.totalCandidates}</td>
                                        <td className="py-3 px-2 text-center">
                                            {dept.hiredCount > 0 ? (
                                                <span className="text-green-600 font-bold">{dept.hiredCount}</span>
                                            ) : (
                                                <span className="text-slate-400">0</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-xs font-semibold">{dept.conversionRate}%</span>
                                                <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-green-500 h-full" style={{ width: `${dept.conversionRate}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users Activity Feed */}
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Activité Récente</h3>
                    <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-8">
                        {data.recentActivity.map((log, idx) => (
                            <div key={idx} className="mb-0 ml-6 relative">
                                <span className={`absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-boxdark ${log.color || 'bg-blue-500'}`}></span>
                                <div className="flex flex-col">
                                    <p className="text-xs text-slate-500 mb-0.5">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(log.time).toLocaleDateString()}</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                        {log.user} <span className="font-normal text-slate-600 dark:text-slate-400">{log.action}</span>
                                    </p>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">{log.target}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-center text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors border-t border-slate-100 pt-4">
                        Voir tout l'historique
                    </button>
                </div>
            </div>
        </div>
    );
}
