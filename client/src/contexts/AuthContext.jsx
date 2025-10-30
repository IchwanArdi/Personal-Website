import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      try {
        const res = await fetch(`${apiBase}/api/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (!mounted) return;
        setUser(data.authenticated ? data.user : null);
      } catch (_) {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  const login = useCallback(
    async (email, password) => {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login gagal');
      }
      const data = await res.json();
      setUser(data.user);
      return data.user;
    },
    [apiBase]
  );

  const logout = useCallback(async () => {
    await fetch(`${apiBase}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  }, [apiBase]);

  const value = useMemo(() => ({ user, loading, isAuthenticated: !!user, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
