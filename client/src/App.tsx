import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { CLIENT_AUTH_PATHS } from "../../shared/constants/auth.constants";

/**
 * INTEGRATION NOTE FOR MODULE 1:
 * Module 1 owns the overall navigation/layout shell (Dashboard, Games,
 * Progress, Profile, Settings) and should render its own <Routes> tree.
 * To integrate Module 2:
 *   1. Wrap your existing route tree with <AuthProvider>...</AuthProvider>.
 *   2. Add the /login and /register routes below (unprotected).
 *   3. Wrap every existing protected page element with <ProtectedRoute>.
 *   4. Replace the DashboardPage import here with Module 1's real one.
 *   5. Use useAuth() from src/hooks/useAuth.ts anywhere you need the
 *      current user or a logout action (see <LogoutButton /> for an example).
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={CLIENT_AUTH_PATHS.login} element={<LoginPage />} />
          <Route path={CLIENT_AUTH_PATHS.register} element={<RegisterPage />} />

          <Route
            path={CLIENT_AUTH_PATHS.dashboard}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Other modules add their own <Route> entries here, wrapped in
              <ProtectedRoute> as needed. */}

          <Route path="/" element={<Navigate to={CLIENT_AUTH_PATHS.dashboard} replace />} />
          <Route path="*" element={<Navigate to={CLIENT_AUTH_PATHS.dashboard} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
