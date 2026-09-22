import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CLIENT_AUTH_PATHS } from "../../../shared/constants/auth.constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wrap any route that requires an authenticated user.
 * Other modules (Games, Progress, Profile, Settings, Dashboard) should
 * wrap their route elements with this component:
 *
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   } />
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-lg text-gray-600">Checking your session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={CLIENT_AUTH_PATHS.login} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
