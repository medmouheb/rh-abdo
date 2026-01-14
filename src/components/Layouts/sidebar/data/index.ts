import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Vue d'ensemble",
            url: "/",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
    ],
  },
  {
    label: "RECRUITMENT",
    items: [
      {
        title: "Demandes d'Embauche",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Créer une demande",
            url: "/hiring-requests/create",
          },
        ],
      },
      {
        title: "Candidatures",
        icon: Icons.User,
        items: [
          {
            title: "Liste des candidats",
            url: "/candidates",
          },
          {
            title: "Nouvelle candidature",
            url: "/candidates/create",
          },
        ],
      },
      {
        title: "Positions Vacantes",
        icon: Icons.Table,
        url: "/vacant-positions",
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
