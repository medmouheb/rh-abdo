"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { usePathname } from "next/navigation";
import { UserSelector } from "./user-selector";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();

  // Helper to format pathname into a readable title
  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Tableau de Bord';

    const lastSegment = segments[segments.length - 1];
    // Capitalize and replace special chars
    return lastSegment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .replace('Kpi', 'KPI')
      .replace('Rh', 'RH');
  };

  return (
    <header className="sticky top-0 z-40 w-full flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4 transition-all dark:border-strokedark dark:bg-boxdark/90">

      {/* LEFT SECTION: Mobile Toggle & System Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-meta-4 lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {isMobile && (
          <Link href={"/"} className="block shrink-0 lg:hidden">
            <Image
              src={"/images/logo/logo-icon.svg"}
              width={32}
              height={32}
              alt="Logo"
            />
          </Link>
        )}

        {/* System Title with Icon */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-primary/30 bg-primary/5">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
              Système de Recrutement
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
              Gestion complète du recrutement
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: User Selector, Search & Tools */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* User Selector Dropdown - Center */}
        <UserSelector />

        {/* Search Bar - Hidden on small mobile */}
        <div className="relative hidden md:block w-full max-w-[280px]">
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-indigo-500 shadow-sm"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggleSwitch />
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-strokedark hidden sm:block"></div>

          <Notification />

          <UserInfo />
        </div>
      </div>
    </header>
  );
}
