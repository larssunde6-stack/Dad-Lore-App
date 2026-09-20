import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
  created_by: string | null;
  created_by_username: string | null;
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
    createdBy: row.created_by,
    createdByUsername: row.created_by_username,
  };
}

type ActivitiesContextValue = {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const ActivitiesContext = createContext<ActivitiesContextValue | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError(null);
      setActivities((data as ActivityRow[] | null)?.map(mapRow) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const value: ActivitiesContextValue = {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}

export function useActivities() {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return ctx;
}
