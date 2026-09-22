import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

/**
 * Shell used by every authenticated page (Dashboard, Games, Progress, Profile,
 * Settings). AuthLayout (login/register) does not use this — see AuthLayout.tsx.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main id="main-content" tabIndex={-1} className="flex-1 px-4 pb-20 pt-6 md:px-8 md:pb-8">
          <Outlet />
          <footer className="mt-12 border-t border-neutral-200 pt-6">
            <MedicalDisclaimer />
          </footer>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
