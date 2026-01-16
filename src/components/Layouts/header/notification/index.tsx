"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BellIcon } from "./icons";
import { apiRequest } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number;
  relatedType?: string;
}

export function Notification() {
  const { isAuthenticated, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const isDotVisible = unreadCount > 0;

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/notifications?unreadOnly=false");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await apiRequest(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unreadNotifications.map((n) =>
          apiRequest(`/api/notifications/${n.id}`, {
            method: "PATCH",
            body: JSON.stringify({ isRead: true }),
          })
        )
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "INTERVIEW_VALIDATED":
        return "✅";
      case "HIRING_REQUEST":
        return "📋";
      case "CANDIDATE_UPDATE":
        return "👤";
      default:
        return "🔔";
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedType === "interview" && notification.relatedId) {
      return `/candidates?interviewId=${notification.relatedId}`;
    }
    if (notification.relatedType === "candidate" && notification.relatedId) {
      return `/candidates/${notification.relatedId}`;
    }
    if (notification.relatedType === "hiringRequest" && notification.relatedId) {
      return `/hiring-requests`;
    }
    return "#";
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />

          {isDotVisible && (
            <motion.span
              className={cn(
                "absolute right-0 top-0 z-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-gray-2 dark:ring-dark-3",
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-500 opacity-75" />
            </motion.span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem] max-w-[24rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
                {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
              </span>
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Tout marquer lu
              </button>
            </div>
          )}
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {loading ? (
            <li className="px-2 py-4 text-center text-sm text-gray-500">
              Chargement...
            </li>
          ) : notifications.length === 0 ? (
            <li className="px-2 py-8 text-center text-sm text-gray-500">
              <BellIcon className="mx-auto mb-2 opacity-30" />
              Aucune notification
            </li>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.li
                  key={notification.id}
                  role="menuitem"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "rounded-lg transition-colors",
                    !notification.isRead && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                >
                  <Link
                    href={getNotificationLink(notification)}
                    onClick={() => {
                      setIsOpen(false);
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                    }}
                    className="flex items-start gap-3 rounded-lg px-2 py-2.5 outline-none hover:bg-gray-2 focus-visible:bg-gray-2 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3"
                  >
                    <div className="mt-0.5 text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <strong
                          className={cn(
                            "block text-sm font-medium",
                            !notification.isRead
                              ? "text-dark dark:text-white"
                              : "text-dark-5 dark:text-dark-6"
                          )}
                        >
                          {notification.title}
                        </strong>
                        {!notification.isRead && (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-dark-5 dark:text-dark-6">
                        {notification.message}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(notification.createdAt).toLocaleString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          )}
        </ul>

        {notifications.length > 0 && (
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
          >
            Voir toutes les notifications
          </Link>
        )}
      </DropdownContent>
    </Dropdown>
  );
}
