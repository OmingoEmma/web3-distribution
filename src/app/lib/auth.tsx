'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Role = 'admin' | 'creator' | 'contributor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface UserSettings {
  notifyResurfacingHours: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  settings: UserSettings;
  login: (email: string, name?: string, role?: Role) => void;
  signup: (name: string, email: string, role: Role) => void;
  logout: () => void;
  setNotifyResurfacingHours: (hours: number) => void;
  listUsers: () => AuthUser[];
  setUserRole: (userId: string, role: Role) => void;
  inviteUser: (name: string, email: string, role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_SETTINGS: UserSettings = {
  notifyResurfacingHours: 6,
};

function getUserKey(userId: string) {
  return `crt_settings_${userId}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  // Load user and settings from localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('crt_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as AuthUser;
        setUser(parsed);
        const rawSettings = localStorage.getItem(getUserKey(parsed.id));
        if (rawSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) });
      }
    } catch {}
  }, []);

  // Persist settings per user
  useEffect(() => {
    try {
      if (user) localStorage.setItem(getUserKey(user.id), JSON.stringify(settings));
    } catch {}
  }, [user, settings]);

  const login = (email: string, name?: string, role: Role = 'creator') => {
    const existing = JSON.parse(localStorage.getItem('crt_users') || '[]') as AuthUser[];
    const found = existing.find((u) => u.email === email);
    const authUser: AuthUser = found || {
      id: `user_${Math.random().toString(36).slice(2, 9)}`,
      name: name || email.split('@')[0],
      email,
      role,
    };
    if (!found) localStorage.setItem('crt_users', JSON.stringify([...existing, authUser]));
    setUser(authUser);
    localStorage.setItem('crt_user', JSON.stringify(authUser));
    // Also set cookie for middleware
    try { document.cookie = `crt_user=${encodeURIComponent(JSON.stringify(authUser))}; path=/`; } catch {}
    const rawSettings = localStorage.getItem(getUserKey(authUser.id));
    setSettings(rawSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) } : DEFAULT_SETTINGS);
  };

  const signup = (name: string, email: string, role: Role) => {
    const authUser: AuthUser = {
      id: `user_${Math.random().toString(36).slice(2, 9)}`,
      name,
      email,
      role,
    };
    const existing = JSON.parse(localStorage.getItem('crt_users') || '[]') as AuthUser[];
    localStorage.setItem('crt_users', JSON.stringify([...existing, authUser]));
    localStorage.setItem('crt_user', JSON.stringify(authUser));
    localStorage.setItem(getUserKey(authUser.id), JSON.stringify(DEFAULT_SETTINGS));
    setUser(authUser);
    setSettings(DEFAULT_SETTINGS);
    try { document.cookie = `crt_user=${encodeURIComponent(JSON.stringify(authUser))}; path=/`; } catch {}
  };

  const inviteUser = (name: string, email: string, role: Role) => {
    const invited: AuthUser = {
      id: `user_${Math.random().toString(36).slice(2, 9)}`,
      name,
      email,
      role,
    };
    const existing = JSON.parse(localStorage.getItem('crt_users') || '[]') as AuthUser[];
    localStorage.setItem('crt_users', JSON.stringify([...existing, invited]));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crt_user');
    try { document.cookie = 'crt_user=; Max-Age=0; path=/'; } catch {}
  };

  const setNotifyResurfacingHours = (hours: number) => {
    setSettings((prev) => ({ ...prev, notifyResurfacingHours: hours }));
  };

  const listUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('crt_users') || '[]') as AuthUser[];
    } catch { return []; }
  };

  const setUserRole = (userId: string, role: Role) => {
    try {
      const users = listUsers();
      const updated = users.map(u => u.id === userId ? { ...u, role } : u);
      localStorage.setItem('crt_users', JSON.stringify(updated));
      const current = JSON.parse(localStorage.getItem('crt_user') || 'null') as AuthUser | null;
      if (current && current.id === userId) {
        const next = { ...current, role };
        localStorage.setItem('crt_user', JSON.stringify(next));
        setUser(next);
      }
    } catch {}
  };

  const value = useMemo(
    () => ({ user, settings, login, signup, logout, setNotifyResurfacingHours, listUsers, setUserRole, inviteUser }),
    [user, settings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


