"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { filterNavItemsByRole } from "@/lib/navigation";
import { ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // On desktop, !isOpen usually means 'collapsed' (w-20), on mobile it means 'hidden' (w-0)
  const isCollapsed = !isMobile && !isOpen;

  // Filter navigation items based on user role
  const filteredNavData = useMemo(() => {
    if (!user) return [];
    return filterNavItemsByRole(NAV_DATA, user.role);
  }, [user]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    filteredNavData.some((section) => {
      return section.items.some((item) => {
        return item.items?.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }
            return true;
          }
          return false;
        });
      });
    });
  }, [pathname, filteredNavData]);

  // Animation variants
  const sidebarVariants = {
    mobileClosed: { width: 0, opacity: 0 },
    mobileOpen: { width: 280, opacity: 1 },
    desktopCollapsed: { width: 80, opacity: 1 },
    desktopExpanded: { width: 280, opacity: 1 },
  };

  const getVariant = () => {
    if (isMobile) return isOpen ? "mobileOpen" : "mobileClosed";
    return isOpen ? "desktopExpanded" : "desktopCollapsed";
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "max-w-[280px] border-r border-slate-200 bg-white dark:bg-boxdark dark:border-strokedark shadow-lg z-50 flex flex-col h-screen",
          isMobile ? "fixed bottom-0 top-0 left-0" : "sticky top-0",
        )}
        initial={false}
        animate={getVariant()}
        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
        aria-label="Main navigation"
      >
        {/* Toggle Button (Desktop Only) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-9 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 shadow-md hover:bg-slate-50 hover:text-indigo-600 dark:bg-boxdark dark:border-strokedark dark:text-slate-400 transition-colors"
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        {/* Header Section */}
        <div className={cn("flex flex-col pt-6 pb-4 px-6 relative", isCollapsed ? "items-center px-2" : "")}>
          {/* Logo / Brand */}
          <div className="flex items-center justify-between mb-8 h-8">
            <Link href="/" className="block truncate">
              {isCollapsed ? (
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">R</div>
              ) : (
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:text-white">RH Platform</span>
              )}
            </Link>
            {isMobile && (
              <button onClick={toggleSidebar} className="text-slate-500">
                <ArrowLeftIcon className="size-5" />
              </button>
            )}
          </div>

          {/* User Profile Card */}
          {!isCollapsed && user && (
            <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-slate-50 border border-slate-100 dark:bg-meta-4/30 dark:border-strokedark/50">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-semibold shadow-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.username}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
          )}
          {isCollapsed && user && (
            <div title={user.username} className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white font-semibold mb-6 shadow-sm cursor-default">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 sidebar-scrollbar">
          {filteredNavData.map((section, sectionIndex) => (
            <div key={section.label} className="mb-6">
              {!isCollapsed && (
                <h2 className="mb-3 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.label}
                </h2>
              )}
              {isCollapsed && (
                <div className="h-px w-8 bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
              )}

              <nav className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.title}>
                    {item.items && item.items.length > 0 ? (
                      <div>
                        <MenuItem
                          isActive={item.items.some(({ url }) => url === pathname)}
                          onClick={() => !isCollapsed && toggleExpanded(item.title)}
                          collapsed={isCollapsed}
                          title={item.title}
                          className={cn(isCollapsed ? "justify-center" : "justify-between")}
                        >
                          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                            <item.icon className="size-5 shrink-0" aria-hidden="true" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>

                          {!isCollapsed && (
                            <ChevronUp
                              className={cn(
                                "size-4 transition-transform duration-200 text-slate-400",
                                expandedItems.includes(item.title) ? "rotate-0" : "rotate-180",
                              )}
                            />
                          )}
                        </MenuItem>

                        <AnimatePresence>
                          {!isCollapsed && expandedItems.includes(item.title) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <ul className="mt-1 space-y-1">
                                {item.items.map((subItem) => (
                                  <li key={subItem.title}>
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                      isSub
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <MenuItem
                        as="link"
                        href={("url" in item) ? item.url + "" : "/"}
                        isActive={pathname === (("url" in item) ? item.url : "/")}
                        collapsed={isCollapsed}
                        title={item.title}
                      >
                        <item.icon className="size-5 shrink-0" aria-hidden="true" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </MenuItem>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-strokedark">
          {isCollapsed ? (
            <button className="flex justify-center w-full p-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-white/5">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-white/5">
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
