import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { ApiError } from "../services/api";
import type { SafeUser } from "../types/auth.types";

export interface AuthContextValue {
  /** The signed-in user, or null if signed out. Undefined while the initial session check is in flight. */
  user: SafeUser | null;
  /** True while checking for an existing session on app load. */
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Wraps the app and exposes authentication state + actions via useAuth().
 * Module 1 (App shell/navigation) should render this above <RouterProvider>
 * or the top-level <Routes> so any page can call useAuth().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check whether an existing session cookie is still valid.
  useEffect(() => {
    let isMounted = true;

    authService
      .fetchCurrentUser()
      .then((res) => {
        if (isMounted) setUser(res.user);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (email: string, password: string, passwordConfirmation: string) => {
      const res = await authService.register({ email, password, passwordConfirmation });
      setUser(res.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Even if the network call fails, clear local state so the UI
      // reflects a logged-out state; the cookie will simply expire server-side.
      if (!(err instanceof ApiError)) throw err;
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
