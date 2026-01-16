"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";
import { motion } from "framer-motion";

const menuItemBaseStyles = cva(
  "group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium duration-200 ease-in-out transition-all outline-none ring-offset-2 focus:ring-2 focus:ring-primary/20",
  {
    variants: {
      isActive: {
        true: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        false: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
      },
      collapsed: {
        true: "justify-center px-2",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
      collapsed: false,
    },
  },
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
    isSub?: boolean;
    collapsed?: boolean;
    title?: string;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const Component = props.as === "link" ? Link : motion.button;

  // Conditionally add Link specific props
  const linkProps = props.as === "link" ? {
    href: props.href,
    onClick: () => isMobile && toggleSidebar()
  } : {
    onClick: props.onClick
  };

  return (
    // @ts-ignore
    <Component
      {...linkProps}
      title={props.collapsed ? props.title : undefined}
      className={cn(
        menuItemBaseStyles({
          isActive: props.isActive,
          collapsed: props.collapsed,
        }),
        props.isSub && !props.collapsed && "text-sm pl-11 py-2", // Indent for sub-items
        props.className
      )}
    >
      {props.children}
      {props.isActive && !props.collapsed && !props.isSub && (
        <motion.div
          layoutId="activeNav"
          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
        />
      )}
    </Component>
  );
}
