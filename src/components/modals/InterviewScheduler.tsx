"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface InterviewSchedulerProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onSchedule: (date: Date, time: string, type: string, notes: string) => void;
}

export default function InterviewScheduler({
    isOpen,
    onClose,
    candidateName,
    onSchedule
}: InterviewSchedulerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [interviewType, setInterviewType] = useState("TECHNICAL");
    const [notes, setNotes] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const interviewTypes = [
        { value: "TECHNICAL", label: "🔧 Entretien Technique", color: "bg-blue-500" },
        { value: "HR", label: "💼 Entretien RH", color: "bg-purple-500" },
        { value: "MANAGER", label: "👔 Entretien Manager", color: "bg-green-500" },
        { value: "FINAL", label: "🎯 Entretien Final", color: "bg-orange-500" },
    ];

    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleSchedule = () => {
        if (selectedDate && selectedTime) {
            onSchedule(selectedDate, selectedTime, interviewType, notes);
            onClose();
        }
    };

    const isDateDisabled = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-primary to-purple-600 p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            📅 Planifier un Entretien
                                        </h2>
                                        <p className="text-white/80">
                                            Candidat: <span className="font-semibold">{candidateName}</span>
                                        </p>
                                    </div>
                                    <motion.button
                                        onClick={onClose}
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Interview Type Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
                                        Type d'Entretien
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {interviewTypes.map((type) => (
                                            <motion.button
                                                key={type.value}
                                                onClick={() => setInterviewType(type.value)}
                                                className={`p-3 rounded-lg border-2 transition-all ${interviewType === type.value
                                                    ? `${type.color} border-transparent text-white shadow-lg`
                                                    : "border-stroke dark:border-dark-3 text-dark dark:text-white hover:border-primary"
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="text-sm font-medium">{type.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendar */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
                                        Sélectionner une Date
                                    </label>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                        {/* Month Navigation */}
                                        <div className="flex items-center justify-between mb-4">
                                            <motion.button
                                                onClick={previousMonth}
                                                className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                ←
                                            </motion.button>
                                            <h3 className="text-lg font-bold text-dark dark:text-white">
                                                {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <motion.button
                                                onClick={nextMonth}
                                                className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                →
                                            </motion.button>
                                        </div>

                                        {/* Weekday Headers */}
                                        <div className="grid grid-cols-7 gap-2 mb-2">
                                            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                                                <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Days */}
                                        <div className="grid grid-cols-7 gap-2">
                                            {/* Empty cells for days before month starts */}
                                            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                                                <div key={`empty-${index}`} />
                                            ))}

                                            {/* Actual days */}
                                            {Array.from({ length: daysInMonth }).map((_, index) => {
                                                const day = index + 1;
                                                const disabled = isDateDisabled(day);
                                                const selected = isDateSelected(day);

                                                return (
                                                    <motion.button
                                                        key={day}
                                                        onClick={() => {
                                                            if (!disabled) {
                                                                setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                                                            }
                                                        }}
                                                        disabled={disabled}
                                                        className={`
                                                            aspect-square rounded-lg p-2 text-sm font-medium transition-all
                                                            ${disabled
                                                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                                : selected
                                                                    ? 'bg-primary text-white shadow-lg'
                                                                    : 'bg-white dark:bg-gray-700 text-dark dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20'
                                                            }
                                                        `}
                                                        whileHover={!disabled ? { scale: 1.1 } : {}}
                                                        whileTap={!disabled ? { scale: 0.95 } : {}}
                                                    >
                                                        {day}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
                                        Heure de l'Entretien
                                    </label>
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                        {timeSlots.map((time) => (
                                            <motion.button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`p-3 rounded-lg border-2 transition-all ${selectedTime === time
                                                    ? "bg-primary border-primary text-white shadow-lg"
                                                    : "border-stroke dark:border-dark-3 text-dark dark:text-white hover:border-primary"
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {time}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark dark:text-white mb-3">
                                        Notes (optionnel)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Ajouter des notes pour cet entretien..."
                                        className="w-full rounded-lg border-2 border-stroke dark:border-dark-3 bg-transparent p-4 outline-none transition focus:border-primary dark:bg-gray-800"
                                        rows={3}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        onClick={onClose}
                                        className="flex-1 rounded-lg border-2 border-stroke dark:border-dark-3 px-6 py-3 font-semibold text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Annuler
                                    </motion.button>
                                    <motion.button
                                        onClick={handleSchedule}
                                        disabled={!selectedDate || !selectedTime}
                                        className={`flex-1 rounded-lg px-6 py-3 font-semibold text-white shadow-lg ${selectedDate && selectedTime
                                            ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                            : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                                            }`}
                                        whileHover={selectedDate && selectedTime ? { scale: 1.02 } : {}}
                                        whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
                                    >
                                        📅 Planifier l'Entretien
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
