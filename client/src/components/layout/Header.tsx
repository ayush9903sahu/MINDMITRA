import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@shared/constants/routes";

/**
 * Top header. Includes a keyboard-only "skip to content" link (required for
 * accessible navigation past the sidebar) and the app wordmark.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-50 rounded-lg bg-brand-600 px-4 py-2 text-white"
      >
        Skip to main content
      </a>
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 rounded-lg">
          <Brain className="h-8 w-8 text-brand-600" aria-hidden="true" />
          <span className="text-xl font-semibold text-neutral-900">BrainCare</span>
        </Link>
      </div>
    </header>
  );
}
