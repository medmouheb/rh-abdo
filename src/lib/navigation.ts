import React from "react";
import { UserRole, RolePermissions, ROLE_PERMISSIONS } from "@/types/auth";

export interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<any>;
  items?: NavItem[];
  requiredPermission?: keyof RolePermissions;
  allowedRoles?: UserRole[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export function filterNavItemsByRole(
  sections: NavSection[],
  role: UserRole | null
): NavSection[] {
  if (!role) return [];

  const permissions = ROLE_PERMISSIONS[role];

  return sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          // Check if item has role restriction
          if (item.allowedRoles && !item.allowedRoles.includes(role)) {
            return null;
          }

          // Check if item has permission requirement
          if (
            item.requiredPermission &&
            !permissions[item.requiredPermission]
          ) {
            return null;
          }

          // Filter sub-items
          if (item.items && item.items.length > 0) {
            const filteredSubItems = item.items.filter((subItem) => {
              if (
                subItem.allowedRoles &&
                !subItem.allowedRoles.includes(role)
              ) {
                return false;
              }
              if (
                subItem.requiredPermission &&
                !permissions[subItem.requiredPermission]
              ) {
                return false;
              }
              return true;
            });

            // If parent has no visible sub-items and no direct URL, hide it
            if (filteredSubItems.length === 0 && !item.url) {
              return null;
            }

            return {
              ...item,
              items: filteredSubItems,
            };
          }

          return item;
        })
        .filter((item): item is NavItem => item !== null),
    }))
    .filter((section) => section.items.length > 0);
}
