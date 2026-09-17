import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCard from '../components/ActivityCard';
import CompletedLoreCard from '../components/CompletedLoreCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import SegmentedControl from '../components/SegmentedControl';
import { useActivities } from '../hooks/useActivities';
import { completedLore as completedLoreSeed, CompletedLoreEntry } from '../data/completedLore';
import { colors, fonts, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { TabScreenProps } from '../navigation/types';

type Segment = 'To Do' | 'Completed';

type Props = TabScreenProps<'Lore'>;

type CompletedLoreRow = {
  id: string;
  activity_title: string;
  date_completed: string;
  note: string;
  lore_earned: number;
  icon: string;
  lore_summary: string;
};

function mapCompletedRow(row: CompletedLoreRow): CompletedLoreEntry {
  return {
    id: row.id,
    activityTitle: row.activity_title,
    dateCompleted: row.date_completed,
    note: row.note,
    loreEarned: row.lore_earned,
    icon: row.icon,
    loreSummary: row.lore_summary,
  };
}

export default function LoreScreen({ navigation }: Props) {
  const [segment, setSegment] = useState<Segment>('To Do');
  const { activities, loading: activitiesLoading } = useActivities();
  const { savedIds, toggleSaved } = useSaved();
  const { userId } = useAuth();
  const savedActivities = activities.filter((a) => savedIds.has(a.id));

  const [completedEntries, setCompletedEntries] = useState<CompletedLoreEntry[]>([]);
  const [completedLoading, setCompletedLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('completed_lore')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.warn('Failed to load completed lore:', error.message);
        setCompletedLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setCompletedEntries((data as CompletedLoreRow[]).map(mapCompletedRow));
        setCompletedLoading(false);
        return;
      }

      // First time this device has an identity with no diary yet — seed
      // the demo entries so there's something to look at, same content
      // as before but now a real write instead of a hardcoded import.
      const seedRows = completedLoreSeed.map((entry) => ({
        user_id: userId,
        activity_title: entry.activityTitle,
        date_completed: entry.dateCompleted,
        note: entry.note,
        lore_earned: entry.loreEarned,
        icon: entry.icon,
        lore_summary: entry.loreSummary,
      }));

      const { data: inserted, error: insertError } = await supabase
        .from('completed_lore')
        .insert(seedRows)
        .select('*');

      if (cancelled) return;

      if (insertError) {
        console.warn('Failed to seed completed lore:', insertError.message);
      } else if (inserted) {
        setCompletedEntries((inserted as CompletedLoreRow[]).map(mapCompletedRow));
      }
      setCompletedLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TopBar loreBalance={1240} showSearch={false} />
        <PillHeader title="LORE" />
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
          data={completedEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <SectionPill label="Your Private Diary" count={completedEntries.length} />
              <Text style={styles.privacyNote}>
                Only you can see this. Nobody else's completed lore shows up here either.
              </Text>
            </View>
          }
          ListEmptyComponent={
            completedLoading ? (
              <View style={styles.empty}>
                <ActivityIndicator color={colors.orange} />
              </View>
            ) : (
              <View style={styles.empty}>
                <MaterialCommunityIcons name="notebook-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No lore logged yet</Text>
                <Text style={styles.emptyBody}>
                  Once you've done something worth remembering, log it here.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => <CompletedLoreCard entry={item} />}
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
  privacyNote: {
    color: colors.textMuted,
    fontSize: 11.5,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
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
