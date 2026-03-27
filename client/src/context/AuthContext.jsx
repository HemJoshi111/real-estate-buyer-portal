import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import { AuthContext } from "./auth-context";

const STORAGE_KEY = "buyer_portal_auth";

const readStoredAuth = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const [loadingAuth, setLoadingAuth] = useState(true);

  const saveAuth = useCallback((payload) => {
    setAuth(payload);

    if (payload?.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const logout = useCallback(async () => {
    try {
      const existing = readStoredAuth();
      if (existing?.token) {
        await api.logout(existing.token);
      }
    } catch {
      // If backend logout fails, still clear local auth to complete sign-out UX.
    } finally {
      saveAuth(null);
    }
  }, [saveAuth]);

  const hydrateProfile = useCallback(async () => {
    const existing = readStoredAuth();

    if (!existing?.token) {
      setLoadingAuth(false);
      return;
    }

    try {
      const profile = await api.getProfile(existing.token);
      saveAuth({ ...existing, user: profile });
    } catch {
      saveAuth(null);
    } finally {
      setLoadingAuth(false);
    }
  }, [saveAuth]);

  useEffect(() => {
    hydrateProfile();
  }, [hydrateProfile]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await api.login({ email, password });
      const nextAuth = {
        token: data.token,
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
      };

      saveAuth(nextAuth);
      return nextAuth;
    },
    [saveAuth],
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      const data = await api.register({ name, email, password });
      const nextAuth = {
        token: data.token,
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
      };

      saveAuth(nextAuth);
      return nextAuth;
    },
    [saveAuth],
  );

  const value = useMemo(
    () => ({
      auth,
      token: auth?.token ?? null,
      user: auth?.user ?? null,
      isAuthenticated: Boolean(auth?.token),
      loadingAuth,
      login,
      register,
      logout,
    }),
    [auth, loadingAuth, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
