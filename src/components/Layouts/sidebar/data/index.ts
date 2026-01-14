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
            title: "DashboardRecruitment",
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
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Tables",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
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
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
     
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
