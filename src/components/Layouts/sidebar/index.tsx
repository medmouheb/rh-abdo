"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { AnimatePresence, motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    NAV_DATA.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
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
  }, [pathname]);

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
          "max-w-[290px] overflow-hidden border-r border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-lg z-50",
          isMobile ? "fixed bottom-0 top-0" : "sticky top-0 h-screen",
        )}
        initial={false}
        animate={{
          width: isOpen ? "290px" : "0px",
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen ? ("true" as any) : undefined}
      >
        <div className="flex h-full flex-col py-8 pl-6 pr-4">
          <div className="relative mb-8 flex items-center justify-between">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="block"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeftIcon className="size-6" />
              </button>
            )}
          </div>

          <div className="sidebar-scrollbar flex-1 overflow-y-auto pr-2">
            {NAV_DATA.map((section, sectionIndex) => (
              <motion.div
                key={section.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="mb-8"
              >
                <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-4">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div className="space-y-1">
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                              className="justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon
                                  className="size-5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{item.title}</span>
                              </div>

                              <ChevronUp
                                className={cn(
                                  "size-4 transition-transform duration-200",
                                  expandedItems.includes(item.title)
                                    ? "rotate-0"
                                    : "rotate-180",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            <AnimatePresence>
                              {expandedItems.includes(item.title) && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="overflow-hidden pl-4"
                                >
                                  {item.items.map((subItem) => (
                                    <li key={subItem.title} className="mt-1">
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
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                item.title.toLowerCase().split(" ").join("-");

                            return (
                              <MenuItem
                                as="link"
                                href={href}
                                isActive={pathname === href}
                              >
                                <item.icon
                                  className="size-5 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{item.title}</span>
                              </MenuItem>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
