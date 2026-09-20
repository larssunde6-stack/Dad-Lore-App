import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Activity } from '../data/activities';

type ActivityRow = {
  id: string;
  title: string;
  icon: string;
  blurb: string;
  duration: string;
  lore_rating: number;
  risk_level: Activity['riskLevel'];
  kind: Activity['kind'];
  fun_type: Activity['funType'];
  tags: string[];
};

function mapRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    blurb: row.blurb,
    duration: row.duration,
    loreRating: row.lore_rating,
    riskLevel: row.risk_level,
    kind: row.kind,
    funType: row.fun_type,
    tags: row.tags,
  };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setActivities((data as ActivityRow[] | null)?.map(mapRow) ?? []);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { activities, loading, error };
}
