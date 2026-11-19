import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

// AuthContext holds ONE source of truth for "am I logged in?".
// Every component that needs the user (Header, pages) reads from here.
// We deliberately keep the token OUT of localStorage - the session lives in
// an HttpOnly cookie managed by the backend, so JavaScript cannot steal it.

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until the first /me check finishes
  const [error, setError] = useState('');

  // On every page load we ask the backend "who am I?".
  // If the session cookie is valid, we get the user back. Otherwise null.
  useEffect(() => {
    let cancelled = false;

    api
      .me()
      .then((data) => {
        if (cancelled) return;
        setUser(data);
      })
      .catch(() => {
        // 401 = not logged in. That is NOT an error - it is the logged-out state.
        if (cancelled) return;
        setUser(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function signup(name, email, password) {
    setError('');
    const data = await api.signup({ name, email, password });
    setUser(data);
    return data;
  }

  async function login(email, password) {
    setError('');
    const data = await api.login({ email, password });
    setUser(data);
    return data;
  }

  async function logout() {
    setError('');
    await api.logout();
    setUser(null);
  }

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}