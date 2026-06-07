'use client';

import { create } from 'zustand';

interface AdminInfo {
  id: string;
  email: string;
  name: string | null;
}

interface AdminAuthState {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
}

export const useAdminAuth = create<AdminAuthState>((set, get) => ({
  token: null,
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login gagal');
    }

    localStorage.setItem('admin_token', data.token);
    set({
      token: data.token,
      admin: data.admin,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    const { token } = get();
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore errors on logout
      }
    }
    localStorage.removeItem('admin_token');
    set({
      token: null,
      admin: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  verify: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      set({ token: null, admin: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem('admin_token');
        set({ token: null, admin: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const data = await response.json();
      set({
        token,
        admin: data.admin,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('admin_token');
      set({ token: null, admin: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
