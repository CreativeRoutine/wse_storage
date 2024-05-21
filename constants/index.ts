import { SidebarLink, SettingsLink } from "@/types";

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/images/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/storage.svg",
    route: "/storage",
    label: "Storage",
  },
  {
    imgURL: "/images/icons/printer.svg",
    route: "/printers",
    label: "Printers",
  },
  {
    imgURL: "/images/icons/users.svg",
    route: "/users",
    label: "Users",
  },
  {
    imgURL: "/assets/icons/parts.svg",
    route: "/parts",
    label: "Parts",
  },
  {
    imgURL: "/assets/icons/gear.svg",
    route: "/settings",
    label: "Settings",
  },
  // {
  //   imgURL: "/images/icons/suitcase.svg",
  //   route: "/jobs",
  //   label: "Find Jobs",
  // },
  // {
  //   imgURL: "/images/icons/tag.svg",
  //   route: "/tags",
  //   label: "Tags",
  // },
  // {
  //   imgURL: "/assets/icons/user.svg",
  //   route: "/profile",
  //   label: "Profile",
  // },
  // {
  //   imgURL: "/assets/icons/question.svg",
  //   route: "/ask-question",
  //   label: "Ask a question",
  // },
];

export const settingsLinks: SettingsLink[] = [
  {
    route: "/settings/suppliers",
    label: "Suppliers",
  },
  {
    route: "/settings/makes",
    label: "Printers names",
  },
]