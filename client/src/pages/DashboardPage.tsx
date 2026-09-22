import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "../components/LogoutButton";

/**
 * TEMPORARY placeholder so Module 2 can be exercised end-to-end.
 * Module 1 owns the real Dashboard page and navigation shell — replace
 * this file's contents (not its route) when Module 1 is integrated.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-4 text-lg text-gray-700">
        You are signed in as <span className="font-semibold">{user?.email}</span>.
      </p>
      <p className="mt-2 text-base text-gray-500">
        This is a placeholder page provided by Module 2 for testing the protected route. Module 1
        should own the real Dashboard implementation.
      </p>
    </main>
  );
}
