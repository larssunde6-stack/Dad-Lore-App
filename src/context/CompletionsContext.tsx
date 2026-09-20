import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type CompletionEntry = {
  id: string;
  activityId: string;
  xpEarned: number;
  completedAt: string;
};

type CompletionsContextValue = {
  completions: CompletionEntry[];
  xp: number;
  loading: boolean;
  refetch: () => Promise<void>;
};

const CompletionsContext = createContext<CompletionsContextValue | undefined>(undefined);

export function CompletionsProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [completions, setCompletions] = useState<CompletionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletions = useCallback(async () => {
    if (!userId) {
      setCompletions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('activity_completions')
      .select('id, activity_id, xp_earned, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (!error && data) {
      setCompletions(
        data.map((row) => ({
          id: row.id,
          activityId: row.activity_id,
          xpEarned: row.xp_earned,
          completedAt: row.completed_at,
        }))
      );
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    fetchCompletions();
  }, [fetchCompletions]);

  const xp = useMemo(() => completions.reduce((sum, entry) => sum + entry.xpEarned, 0), [completions]);

  const value = useMemo(
    () => ({ completions, xp, loading, refetch: fetchCompletions }),
    [completions, xp, loading, fetchCompletions]
  );

  return <CompletionsContext.Provider value={value}>{children}</CompletionsContext.Provider>;
}

export function useCompletions() {
  const ctx = useContext(CompletionsContext);
  if (!ctx) {
    throw new Error('useCompletions must be used within a CompletionsProvider');
  }
  return ctx;
}
