"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function UserSelector() {
  const { user } = useAuth();

  const displayName = user?.username 
    ? `${user.username} (${user.role})`
    : "Non connecté";

  return (
    <Dropdown>
      <DropdownTrigger className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-meta-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">{displayName}</span>
          <span className="sm:hidden">{user?.role || "User"}</span>
          <ChevronUpIcon 
            className="h-4 w-4 text-gray-500 dark:text-gray-400 rotate-180"
            strokeWidth={2}
          />
        </div>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-w-[200px]"
        align="start"
      >
        <div className="p-3">
          <div className="text-sm font-semibold text-dark dark:text-white">
            {user?.username || "Non connecté"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user?.role || "Aucun rôle"}
          </div>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
