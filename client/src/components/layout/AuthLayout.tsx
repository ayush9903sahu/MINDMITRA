import { Outlet } from "react-router-dom";
import { Brain } from "lucide-react";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

/** Layout for unauthenticated pages (login/register) — centered card, no nav. */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-50 px-4 py-12">
      <div className="flex items-center gap-2">
        <Brain className="h-9 w-9 text-brand-600" aria-hidden="true" />
        <span className="text-2xl font-semibold text-neutral-900">BrainCare</span>
      </div>
      <main id="main-content" tabIndex={-1} className="w-full max-w-md">
        <Outlet />
      </main>
      <MedicalDisclaimer />
    </div>
  );
}
