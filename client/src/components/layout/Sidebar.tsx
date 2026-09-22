import { NavLink } from "react-router-dom";
import { PRIMARY_NAV_ITEMS } from "@/utils/navigation";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

/** Persistent left-hand navigation for desktop/tablet. Hidden on mobile (see MobileNav). */
export function Sidebar() {
  return (
    <nav
      aria-label="Primary"
      className="hidden w-64 shrink-0 flex-col gap-1 border-r border-neutral-200 bg-white p-4 md:flex"
    >
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex min-h-touch items-center gap-3 rounded-xl px-4 text-base font-medium transition-colors
            ${isActive ? "bg-brand-50 text-brand-700" : "text-neutral-700 hover:bg-neutral-100"}`
          }
        >
          {({ isActive }) => (
            <>
              <DynamicIcon name={item.icon} className="h-6 w-6" />
              <span>{item.label}</span>
              {isActive && <span className="sr-only">(current page)</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
