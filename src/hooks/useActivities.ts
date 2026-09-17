import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, Category } from '../data/activities';

type ActivityRow = {
  id: string;
  title: string;
  category: Category;
  icon: string;
  blurb: string;
  location: string;
  distance: string;
  duration: string;
  lore_rating: number;
  difficulty: Activity['difficulty'];
  tags: string[];
  latitude: number;
  longitude: number;
};

function mapRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    icon: row.icon,
    blurb: row.blurb,
    location: row.location,
    distance: row.distance,
    duration: row.duration,
    loreRating: row.lore_rating,
    difficulty: row.difficulty,
    tags: row.tags,
    coords: { latitude: row.latitude, longitude: row.longitude },
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
