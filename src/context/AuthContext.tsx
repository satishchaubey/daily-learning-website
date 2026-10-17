'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface TotpSetup {
  qrCode: string;
  manualEntryKey: string;
  otpAuthUrl: string;
}

interface AuthContextType extends AuthState {
  // Registration
  register: (username: string, email: string, password: string, phone?: string) => Promise<{ totpSetup: TotpSetup; email: string }>;
  verifyTotpSetup: (email: string, totpCode: string) => Promise<void>;
  // Login
  login: (email: string, password: string) => Promise<{ requiresTotpVerification: boolean; email?: string }>;
  verifyTotpLogin: (email: string, totpCode: string) => Promise<void>;
  // Forgot Password
  forgotPassword: (emailOrPhone: string) => Promise<{ requiresTotpVerification: boolean; email?: string }>;
  verifyTotpForReset: (email: string, totpCode: string) => Promise<{ resetEmailSent: boolean; resetToken?: string }>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<void>;
  // Logout
  logout: () => void;
  // Demo
  loginAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('dm_token');
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data as T;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('dm_token');
    const userStr = localStorage.getItem('dm_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('dm_token');
        localStorage.removeItem('dm_user');
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const setAuth = useCallback((token: string, user: User) => {
    localStorage.setItem('dm_token', token);
    localStorage.setItem('dm_user', JSON.stringify(user));
    // Also keep legacy key for backward compatibility with apiService
    localStorage.setItem('daily_mastery_user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (username: string, email: string, password: string, phone?: string) => {
    const data = await apiFetch<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, phone }),
    });
    return { totpSetup: data.totpSetup as TotpSetup, email: data.email };
  }, []);

  const verifyTotpSetup = useCallback(async (email: string, totpCode: string) => {
    const data = await apiFetch<any>('/auth/verify-totp-setup', {
      method: 'POST',
      body: JSON.stringify({ email, totpCode }),
    });
    setAuth(data.token, data.user);
  }, [setAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!data.requiresTotpVerification) {
      setAuth(data.token, data.user);
    }

    return {
      requiresTotpVerification: data.requiresTotpVerification,
      email: data.email,
    };
  }, [setAuth]);

  const verifyTotpLogin = useCallback(async (email: string, totpCode: string) => {
    const data = await apiFetch<any>('/auth/verify-totp-login', {
      method: 'POST',
      body: JSON.stringify({ email, totpCode }),
    });
    setAuth(data.token, data.user);
  }, [setAuth]);

  const forgotPassword = useCallback(async (emailOrPhone: string) => {
    const data = await apiFetch<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone }),
    });
    return {
      requiresTotpVerification: data.requiresTotpVerification,
      email: data.email,
    };
  }, []);

  const verifyTotpForReset = useCallback(async (email: string, totpCode: string) => {
    const data = await apiFetch<any>('/auth/verify-totp-reset', {
      method: 'POST',
      body: JSON.stringify({ email, totpCode }),
    });
    return { resetEmailSent: data.resetEmailSent, resetToken: data.resetToken };
  }, []);

  const resetPassword = useCallback(async (resetToken: string, newPassword: string) => {
    await apiFetch<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dm_token');
    localStorage.removeItem('dm_user');
    localStorage.removeItem('daily_mastery_user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const loginAsDemo = useCallback(async () => {
    const data = await apiFetch<any>('/auth/demo');
    setAuth(data.token, data.user);
  }, [setAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        verifyTotpSetup,
        login,
        verifyTotpLogin,
        forgotPassword,
        verifyTotpForReset,
        resetPassword,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
