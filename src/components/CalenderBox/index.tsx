"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface Interview {
  id: number;
  type: string;
  scheduledAt: string;
  comments?: string;
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

const INTERVIEW_COLORS = {
  TECHNICAL: "bg-blue-500 hover:bg-blue-600",
  HR: "bg-purple-500 hover:bg-purple-600",
  MANAGER: "bg-green-500 hover:bg-green-600",
  FINAL: "bg-orange-500 hover:bg-orange-600",
};

const INTERVIEW_LIGHT_COLORS = {
  TECHNICAL: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-500",
  HR: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-500",
  MANAGER: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-500",
  FINAL: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-500",
};

const INTERVIEW_ICONS = {
  TECHNICAL: "🔧",
  HR: "💼",
  MANAGER: "👔",
  FINAL: "🎯",
};

const CalendarBox = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch('/api/interviews');
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get interviews for a specific date
  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview =>
      isSameDay(new Date(interview.scheduledAt), date)
    );
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Organize days into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="space-y-4">
      {/* Google Calendar Style Header */}
      <motion.div
        className="rounded-xl bg-white dark:bg-gray-dark shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left side - Month/Year and Navigation */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={goToToday}
                className="px-4 py-2 rounded-lg border-2 border-stroke dark:border-dark-3 text-dark dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aujourd'hui
              </motion.button>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={previousMonth}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-dark dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-dark dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              <h2 className="text-2xl font-semibold text-dark dark:text-white">
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </h2>
            </div>

            {/* Right side - View toggles and stats */}
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{interviews.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
                <div className="w-px h-8 bg-stroke dark:bg-dark-3" />
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    {interviews.filter(i => new Date(i.scheduledAt) >= new Date()).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">À venir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Google Calendar Style Grid */}
      <motion.div
        className="rounded-xl bg-white dark:bg-gray-dark shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Weekday Headers - Google Calendar Style */}
        <div className="grid grid-cols-7 border-b border-stroke dark:border-dark-3">
          {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
            >
              <span className="hidden md:inline">{day}</span>
              <span className="md:hidden">{day.substring(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-50 dark:bg-gray-900/50">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 border-b border-stroke dark:border-dark-3 last:border-b-0">
              {week.map((day) => {
                const dayInterviews = getInterviewsForDate(day);
                const isTodayDate = isToday(day);
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

                return (
                  <motion.div
                    key={day.toString()}
                    className={`
                      min-h-[120px] border-r border-stroke dark:border-dark-3 last:border-r-0 p-2
                      ${!isCurrentMonth ? 'bg-gray-100/50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-dark'}
                      hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                    `}
                    whileHover={{ scale: 1.01 }}
                  >
                    {/* Date number */}
                    <div className="flex items-center justify-between mb-2">
                      <motion.div
                        className={`
                          w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                          ${isTodayDate
                            ? 'bg-primary text-white'
                            : isCurrentMonth
                              ? 'text-dark dark:text-white'
                              : 'text-gray-400 dark:text-gray-600'
                          }
                        `}
                        whileHover={isTodayDate ? {} : { scale: 1.2 }}
                      >
                        {format(day, 'd')}
                      </motion.div>
                      {dayInterviews.length > 0 && (
                        <span className="text-xs font-semibold text-primary">
                          {dayInterviews.length}
                        </span>
                      )}
                    </div>

                    {/* Interviews for this day - Google Calendar Style */}
                    <div className="space-y-1">
                      {dayInterviews.slice(0, 3).map((interview) => (
                        <motion.div
                          key={interview.id}
                          onClick={() => setSelectedInterview(interview)}
                          className={`
                            text-xs px-2 py-1 rounded cursor-pointer border-l-3 truncate
                            ${INTERVIEW_LIGHT_COLORS[interview.type as keyof typeof INTERVIEW_LIGHT_COLORS]}
                          `}
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          title={`${format(new Date(interview.scheduledAt), 'HH:mm')} - ${interview.candidate.firstName} ${interview.candidate.lastName}`}
                        >
                          <div className="flex items-center gap-1">
                            <span>{INTERVIEW_ICONS[interview.type as keyof typeof INTERVIEW_ICONS]}</span>
                            <span className="font-medium">{format(new Date(interview.scheduledAt), 'HH:mm')}</span>
                            <span className="truncate">{interview.candidate.firstName}</span>
                          </div>
                        </motion.div>
                      ))}
                      {dayInterviews.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                          +{dayInterviews.length - 3} de plus
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Interview Detail Modal - Google Calendar Style */}
      <AnimatePresence>
        {selectedInterview && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInterview(null)}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="bg-white dark:bg-gray-dark rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with color bar */}
                <div className={`h-2 ${INTERVIEW_COLORS[selectedInterview.type as keyof typeof INTERVIEW_COLORS]}`} />

                <div className="p-6">
                  {/* Close button */}
                  <div className="flex justify-end mb-4">
                    <motion.button
                      onClick={() => setSelectedInterview(null)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Interview details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">
                        {INTERVIEW_ICONS[selectedInterview.type as keyof typeof INTERVIEW_ICONS]}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-dark dark:text-white">
                          {selectedInterview.type === 'TECHNICAL' ? 'Entretien Technique' :
                            selectedInterview.type === 'HR' ? 'Entretien RH' :
                              selectedInterview.type === 'MANAGER' ? 'Entretien Manager' :
                                'Entretien Final'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {format(new Date(selectedInterview.scheduledAt), 'EEEE dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-xl">🕐</span>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Heure</p>
                          <p className="font-semibold text-dark dark:text-white">
                            {format(new Date(selectedInterview.scheduledAt), 'HH:mm')}
                          </p>
                        </div>
                      </div>

                      <Link href={`/candidates/${selectedInterview.candidate.id}`}>
                        <motion.div
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <span className="text-xl">👤</span>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Candidat</p>
                            <p className="font-semibold text-primary">
                              {selectedInterview.candidate.firstName} {selectedInterview.candidate.lastName}
                            </p>
                          </div>
                        </motion.div>
                      </Link>

                      {selectedInterview.comments && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-xl">📝</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                            <p className="text-sm text-dark dark:text-white">
                              {selectedInterview.comments}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Link href={`/candidates/${selectedInterview.candidate.id}`} className="flex-1">
                        <motion.button
                          className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Voir le candidat
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <motion.div
            className="bg-white dark:bg-gray-dark rounded-xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
            <p className="mt-4 text-dark dark:text-white font-medium">Chargement...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CalendarBox;
