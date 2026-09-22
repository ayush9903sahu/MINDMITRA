import { NavLink } from "react-router-dom";
import { PRIMARY_NAV_ITEMS } from "@/utils/navigation";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

/** Fixed bottom navigation shown on small screens instead of the Sidebar. */
export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-neutral-200 bg-white md:hidden"
    >
      {PRIMARY_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex min-h-touch flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium
            ${isActive ? "text-brand-700" : "text-neutral-600"}`
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
