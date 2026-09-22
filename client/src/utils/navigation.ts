import { ROUTES } from "@shared/constants/routes";
import { NavItem } from "@/types";

/**
 * Primary navigation, shared by the desktop Sidebar and MobileNav so the two
 * never drift out of sync. Icon names map to lucide-react components in
 * components/layout/NavIcon.tsx.
 */
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Games", path: ROUTES.GAMES, icon: "Gamepad2" },
  { label: "Progress", path: ROUTES.PROGRESS, icon: "LineChart" },
  { label: "Profile", path: ROUTES.PROFILE, icon: "User" },
  { label: "Settings", path: ROUTES.SETTINGS, icon: "Settings" },
];
