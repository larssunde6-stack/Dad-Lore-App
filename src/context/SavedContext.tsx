import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type ToggleSavedResult =
  | { status: 'saved' }
  | { status: 'removed' }
  | { status: 'error'; message: string };

type SavedContextValue = {
  savedIds: Set<string>;
  pendingIds: Set<string>;
  toggleSaved: (id: string) => Promise<ToggleSavedResult>;
};

const SavedContext = createContext<SavedContextValue | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { userId, isReady, authError } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('saved_lore')
        .select('activity_id')
        .eq('user_id', userId);

      if (!cancelled && !error && data) {
        setSavedIds(new Set(data.map((row) => row.activity_id as string)));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggleSaved = async (id: string): Promise<ToggleSavedResult> => {
    if (pendingIds.has(id)) {
      return { status: 'error', message: 'Already working on that — hang on.' };
    }

    if (!userId) {
      const message =
        isReady && authError
          ? `Not signed in: ${authError}`
          : 'Still signing you in — try again in a moment.';
      return { status: 'error', message };
    }

    const wasSaved = savedIds.has(id);

    setPendingIds((prev) => new Set(prev).add(id));

    // Optimistic update, reverted below if the write fails.
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    let result: ToggleSavedResult;

    if (wasSaved) {
      const { error } = await supabase
        .from('saved_lore')
        .delete()
        .eq('user_id', userId)
        .eq('activity_id', id);
      if (error) {
        console.warn('Failed to unsave lore:', error.message);
        setSavedIds((prev) => new Set(prev).add(id));
        result = { status: 'error', message: error.message };
      } else {
        result = { status: 'removed' };
      }
    } else {
      const { error } = await supabase
        .from('saved_lore')
        .insert({ user_id: userId, activity_id: id });
      if (error) {
        console.warn('Failed to save lore:', error.message);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        result = { status: 'error', message: error.message };
      } else {
        result = { status: 'saved' };
      }
    }

    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    return result;
  };

  const value = useMemo(
    () => ({ savedIds, pendingIds, toggleSaved }),
    [savedIds, pendingIds, userId]
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return ctx;
}
