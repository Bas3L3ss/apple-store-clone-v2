import { useMemo } from "react";
import { useLocation } from "react-router";

// Define the route mapping object
const routeMapping = {
  "/dashboard": [{ title: "Dashboard", link: "/dashboard" }],
  "/dashboard/analytics": [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Analytics", link: "/dashboard/analytics" },
  ],
  "/settings/profile": [
    { title: "Settings", link: "/settings" },
    { title: "Profile", link: "/settings/profile" },
  ],
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
