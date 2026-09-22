import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

/**
 * Access authentication state and actions (login, register, logout).
 * Must be used within <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}
