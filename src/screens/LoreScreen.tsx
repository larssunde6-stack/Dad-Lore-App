import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCard from '../components/ActivityCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import SegmentedControl from '../components/SegmentedControl';
import { useActivities } from '../hooks/useActivities';
import { Activity } from '../data/activities';
import { colors, fonts, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { TabScreenProps } from '../navigation/types';

type Segment = 'To Do' | 'Completed';

type Props = TabScreenProps<'Lore'>;

type CompletionRow = {
  id: string;
  activity_id: string;
  xp_earned: number;
  completed_at: string;
};

type CompletedItem = {
  completionId: string;
  activity: Activity;
  xpEarned: number;
  completedAt: string;
};

function mapRowsToItems(rows: CompletionRow[], activities: Activity[]): CompletedItem[] {
  return rows
    .map((row) => {
      const activity = activities.find((a) => a.id === row.activity_id);
      if (!activity) return null;
      return {
        completionId: row.id,
        activity,
        xpEarned: row.xp_earned,
        completedAt: formatCompletedDate(row.completed_at),
      };
    })
    .filter((item): item is CompletedItem => item !== null);
}

function formatCompletedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function LoreScreen({ navigation }: Props) {
  const [segment, setSegment] = useState<Segment>('To Do');
  const { activities, loading: activitiesLoading } = useActivities();
  const { savedIds, toggleSaved } = useSaved();
  const { userId } = useAuth();
  const savedActivities = activities.filter((a) => savedIds.has(a.id));

  const [completionRows, setCompletionRows] = useState<CompletionRow[]>([]);
  const [completedLoading, setCompletedLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCompletedLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('activity_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.warn('Failed to load completed lore:', error.message);
        setCompletedLoading(false);
        return;
      }

      setCompletionRows((data as CompletionRow[] | null) ?? []);
      setCompletedLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const completedItems = useMemo(
    () => mapRowsToItems(completionRows, activities),
    [completionRows, activities]
  );

  const xp = useMemo(
    () => completionRows.reduce((sum, row) => sum + row.xp_earned, 0),
    [completionRows]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TopBar xp={xp} showSearch={false} onProfilePress={() => navigation.navigate('Profile')} />
        <PillHeader title="YOUR LORE" />
        <SegmentedControl
          options={['To Do', 'Completed']}
          value={segment}
          onChange={(value) => setSegment(value as Segment)}
        />
      </View>

      {segment === 'To Do' ? (
        <FlatList
          data={savedActivities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <SectionPill label="Saved To Do" count={savedActivities.length} />
          }
          ListEmptyComponent={
            activitiesLoading ? (
              <View style={styles.empty}>
                <ActivityIndicator color={colors.orange} />
              </View>
            ) : (
              <View style={styles.empty}>
                <MaterialCommunityIcons name="bookmark-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No lore saved yet</Text>
                <Text style={styles.emptyBody}>
                  Tap the bookmark on any lore listing to keep it here for later.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              saved
              onToggleSave={() => toggleSaved(item.id)}
              onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
            />
          )}
        />
      ) : (
        <FlatList
          data={completedItems}
          keyExtractor={(item) => item.completionId}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <SectionPill label="Completed Lore" count={completedItems.length} />
          }
          ListEmptyComponent={
            completedLoading ? (
              <View style={styles.empty}>
                <ActivityIndicator color={colors.orange} />
              </View>
            ) : (
              <View style={styles.empty}>
                <MaterialCommunityIcons
                  name="check-decagram-outline"
                  size={40}
                  color={colors.textMuted}
                />
                <Text style={styles.emptyTitle}>No lore completed yet</Text>
                <Text style={styles.emptyBody}>
                  Mark an activity as done from its detail page to start earning XP.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <ActivityCard
              activity={item.activity}
              completedAt={item.completedAt}
              xpEarned={item.xpEarned}
              onPress={() =>
                navigation.navigate('ActivityDetail', { activityId: item.activity.id })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    marginTop: spacing.md,
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
});
