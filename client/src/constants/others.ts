export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard/",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Product",
    url: "/dashboard/product",
    icon: "product",
    shortcut: ["p", "p"],
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Accounts",
    url: "#", // Placeholder as there is no direct link for the parent
    icon: "billing",
    isActive: true,

    items: [
      {
        title: "Users",
        url: "/dashboard/user",
        icon: "billing",
        shortcut: ["u", "u"],
      },
      {
        title: "Orders",
        shortcut: ["l", "l"],
        url: "/dashboard/orders",
        icon: "login",
      },
    ],
  },
  {
    title: "Kanban",
    url: "/dashboard/kanban",
    icon: "kanban",
    shortcut: ["k", "k"],
    isActive: false,
    items: [], // No child items
  },
];
