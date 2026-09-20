import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { AuthError, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AuthActionResult =
  | { status: 'ok' }
  | { status: 'error'; code: string; message: string };

type AuthContextValue = {
  userId: string | null;
  isReady: boolean;
  authError: string | null;
  isAnonymous: boolean;
  email: string | null;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  logIn: (email: string, password: string) => Promise<AuthActionResult>;
  logOut: () => Promise<AuthActionResult>;
  requestPasswordReset: (email: string) => Promise<AuthActionResult>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<AuthActionResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapAuthError(error: AuthError): string {
  switch (error.code) {
    case 'email_exists':
    case 'user_already_exists':
      return 'That email already has an account. Try logging in instead.';
    case 'invalid_credentials':
      return "That email or password isn't right.";
    case 'weak_password':
      return 'Password must be at least 6 characters.';
    case 'same_password':
      return "That's already your password.";
    case 'otp_expired':
      return 'That code has expired. Request a new one.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts — wait a bit before trying again.';
    case 'email_address_invalid':
    case 'validation_failed':
      return 'Enter a valid email address.';
    default:
      return error.message;
  }
}

function toResult(error: AuthError | null): AuthActionResult {
  if (!error) return { status: 'ok' };
  return { status: 'error', code: error.code ?? 'unknown', message: mapAuthError(error) };
}

async function ensureAnonymousSession(): Promise<{ user: User | null; error: string | null }> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return { user: session.user, error: null };
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw error;
    }
    return { user: data?.user ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not reach the backend.';
    console.warn('Anonymous sign-in failed:', message);
    return { user: null, error: message };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const restoringRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await ensureAnonymousSession();
      if (!cancelled) {
        setUser(result.user);
        setAuthError(result.error);
        setIsReady(true);
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        return;
      }

      if (restoringRef.current) return;
      restoringRef.current = true;

      ensureAnonymousSession().then((result) => {
        restoringRef.current = false;
        setUser(result.user);
        setAuthError(result.error);
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthActionResult> => {
    const { error } = await supabase.auth.updateUser({ email, password });
    return toResult(error);
  };

  const logIn = async (email: string, password: string): Promise<AuthActionResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return toResult(error);
  };

  const logOut = async (): Promise<AuthActionResult> => {
    const { error } = await supabase.auth.signOut();
    return toResult(error);
  };

  const requestPasswordReset = async (email: string): Promise<AuthActionResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return toResult(error);
  };

  const confirmPasswordReset = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<AuthActionResult> => {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery',
    });
    if (verifyError) {
      return toResult(verifyError);
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    return toResult(updateError);
  };

  const value: AuthContextValue = {
    userId: user?.id ?? null,
    isReady,
    authError,
    isAnonymous: user?.is_anonymous ?? true,
    email: user?.email ?? null,
    signUp,
    logIn,
    logOut,
    requestPasswordReset,
    confirmPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
