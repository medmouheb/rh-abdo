"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";
import { motion } from "framer-motion";

const menuItemBaseStyles = cva(
  "group relative flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4",
  {
    variants: {
      isActive: {
        true: "bg-gradient-to-r from-primary/10 to-transparent text-primary dark:text-white dark:from-primary/20",
        false: "text-dark-4 hover:bg-gray-100 hover:text-dark dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
      },
      isSub: {
        true: "text-sm",
        false: "text-base",
      }
    },
    defaultVariants: {
      isActive: false,
      isSub: false,
    },
  },
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
    isSub?: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
            isSub: props.isSub,
            className: "relative block py-2",
          }),
          props.className,
        )}
      >
        <motion.div
          className="flex items-center gap-2.5 w-full"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {props.children}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={menuItemBaseStyles({
        isActive: props.isActive,
        isSub: props.isSub,
        className: "flex w-full items-center gap-3 py-3",
      })}
      initial={{ x: 0 }}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {props.children}
    </motion.button>
  );
}
