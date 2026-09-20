import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type CompletionStat = { activityId: string; xpEarned: number };

export function useCompletions() {
  const { userId } = useAuth();
  const [completions, setCompletions] = useState<CompletionStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletions = useCallback(async () => {
    if (!userId) {
      setCompletions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('activity_completions')
      .select('activity_id, xp_earned')
      .eq('user_id', userId);

    if (!error && data) {
      setCompletions(data.map((row) => ({ activityId: row.activity_id, xpEarned: row.xp_earned })));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    fetchCompletions();
  }, [fetchCompletions]);

  const xp = completions.reduce((sum, entry) => sum + entry.xpEarned, 0);

  return { completions, xp, loading, refetch: fetchCompletions };
}
