import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { CLIENT_AUTH_PATHS } from "../../../shared/constants/auth.constants";

/**
 * Logout control intended for Module 1's navigation/header.
 * Import and drop this into the nav bar: <LogoutButton />
 */
export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate(CLIENT_AUTH_PATHS.login, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:opacity-60"
    >
      <LogOut className="h-5 w-5" aria-hidden="true" />
      {isLoggingOut ? "Logging out…" : "Log out"}
    </button>
  );
}
