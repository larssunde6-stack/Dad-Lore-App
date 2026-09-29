import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getLevel, getRank } from '../utils/level';

export type CompletionEntry = {
  id: string;
  activityId: string;
  xpEarned: number;
  completedAt: string;
};

export type LevelUpEvent = {
  level: number;
  rankName: string;
  rankChanged: boolean;
};

type CompletionsContextValue = {
  completions: CompletionEntry[];
  xp: number;
  loading: boolean;
  refetch: () => Promise<void>;
  levelUpEvent: LevelUpEvent | null;
  dismissLevelUp: () => void;
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

  const prevLevelRef = useRef<number | null>(null);
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);

  useEffect(() => {
    if (loading) return;
    const { level } = getLevel(xp);

    if (prevLevelRef.current === null) {
      prevLevelRef.current = level;
      return;
    }

    if (level > prevLevelRef.current) {
      const prevRank = getRank(prevLevelRef.current);
      const rank = getRank(level);
      setLevelUpEvent({ level, rankName: rank.name, rankChanged: rank.name !== prevRank.name });
    }

    prevLevelRef.current = level;
  }, [xp, loading]);

  const dismissLevelUp = useCallback(() => setLevelUpEvent(null), []);

  const value = useMemo(
    () => ({ completions, xp, loading, refetch: fetchCompletions, levelUpEvent, dismissLevelUp }),
    [completions, xp, loading, fetchCompletions, levelUpEvent, dismissLevelUp]
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
