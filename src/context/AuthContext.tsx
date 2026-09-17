import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthContextValue = {
  userId: string | null;
  isReady: boolean;
  authError: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ensureSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          if (!cancelled) {
            setUserId(session.user.id);
          }
          return;
        }

        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          throw error;
        }
        if (!cancelled) {
          setUserId(data?.user?.id ?? null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not reach the backend.';
        console.warn('Anonymous sign-in failed:', message);
        if (!cancelled) {
          setAuthError(message);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    };

    ensureSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId, isReady, authError }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
