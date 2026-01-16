import * as Icons from "../icons";
import { NavSection } from "@/lib/navigation";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        requiredPermission: "canViewDashboard",
        items: [
          {
            title: "Vue d'ensemble",
            url: "/",
            requiredPermission: "canViewDashboard",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        requiredPermission: "canViewCalendar",
        items: [],
      },
    ],
  },
  {
    label: "RECRUITMENT",
    items: [
      {
        title: "Tableau de Bord",
        icon: Icons.PieChart,
        url: "/recruitment",
        requiredPermission: "canViewDashboard",
        items: [],
      },
      {
        title: "Demandes d'Embauche",
        icon: Icons.Alphabet,
        requiredPermission: "canViewHiringRequests",
        items: [
          {
            title: "Liste des demandes",
            url: "/hiring-requests",
            requiredPermission: "canViewHiringRequests",
          },
          {
            title: "Créer une demande",
            url: "/hiring-requests/create",
            requiredPermission: "canCreateHiringRequests",
          },
        ],
      },
      {
        title: "Candidatures",
        icon: Icons.User,
        requiredPermission: "canViewCandidates",
        items: [
          {
            title: "Liste des candidats",
            url: "/candidates",
            requiredPermission: "canViewCandidates",
          },
          {
            title: "Nouvelle candidature",
            url: "/candidates/create",
            requiredPermission: "canCreateCandidates",
          },
        ],
      },
      {
        title: "Positions Vacantes",
        icon: Icons.Table,
        url: "/vacant-positions",
        requiredPermission: "canViewVacantPositions",
        items: [],
      },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      {
        title: "Utilisateurs",
        icon: Icons.User,
        url: "/users",
        requiredPermission: "canManageUsers",
        items: [],
      },
      {
        title: "Départements",
        icon: Icons.FourCircle,
        url: "/departments",
        requiredPermission: "canManageDepartments",
        items: [],
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Authentication",
        icon: Icons.Authentication,
        requiredPermission: "canViewSettings",
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
