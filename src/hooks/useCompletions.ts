import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type CompletionStat = { activityId: string; xpEarned: number };

export function useCompletions() {
  const { userId } = useAuth();
  const [completions, setCompletions] = useState<CompletionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('activity_completions')
        .select('activity_id, xp_earned')
        .eq('user_id', userId);

      if (!cancelled) {
        if (!error && data) {
          setCompletions(
            data.map((row) => ({ activityId: row.activity_id, xpEarned: row.xp_earned }))
          );
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const xp = completions.reduce((sum, entry) => sum + entry.xpEarned, 0);

  return { completions, xp, loading };
}
