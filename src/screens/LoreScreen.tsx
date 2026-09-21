import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCard from '../components/ActivityCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import SegmentedControl from '../components/SegmentedControl';
import CenterToast, { ToastState } from '../components/CenterToast';
import FilterModal, {
  ActivityFilters,
  EMPTY_FILTERS,
  isFiltersEmpty,
  matchesFilters,
} from '../components/FilterModal';
import { useActivities } from '../context/ActivitiesContext';
import { CompletionEntry, useCompletions } from '../context/CompletionsContext';
import { Activity } from '../data/activities';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Segment = 'To Do' | 'Completed';

type Props = TabScreenProps<'Lore'>;

type CompletedItem = {
  completionId: string;
  activity: Activity;
  xpEarned: number;
  completedAt: string;
};

function mapEntriesToItems(entries: CompletionEntry[], activities: Activity[]): CompletedItem[] {
  return entries
    .map((entry) => {
      const activity = activities.find((a) => a.id === entry.activityId);
      if (!activity) return null;
      return {
        completionId: entry.id,
        activity,
        xpEarned: entry.xpEarned,
        completedAt: formatCompletedDate(entry.completedAt),
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
  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useActivities();
  const { savedIds, pendingIds, toggleSaved } = useSaved();
  const {
    completions,
    xp,
    loading: completionsLoading,
    refetch: refetchCompletions,
  } = useCompletions();
  const [filters, setFilters] = useState<ActivityFilters>(EMPTY_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const filtersActive = !isFiltersEmpty(filters);
  const savedActivities = activities.filter(
    (a) => savedIds.has(a.id) && matchesFilters(a, filters)
  );

  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (next: ToastState) => {
    setToast(next);
    setTimeout(() => setToast(null), 2200);
  };

  const handleToggleSave = async (id: string) => {
    const result = await toggleSaved(id);
    if (result.status === 'saved') {
      showToast({ message: 'Saved', tone: 'success' });
    } else if (result.status === 'removed') {
      showToast({ message: 'Removed from Saved', tone: 'success' });
    } else {
      showToast({ message: result.message, tone: 'error' });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchActivities(), refetchCompletions()]);
    setRefreshing(false);
  };

  const completedItems = useMemo(
    () =>
      mapEntriesToItems(completions, activities).filter((item) =>
        matchesFilters(item.activity, filters)
      ),
    [completions, activities, filters]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TopBar xp={xp} showSearch={false} />
        <PillHeader title="YOUR LORE" onFilterPress={() => setFilterModalVisible(true)} gradient />
        {filtersActive ? (
          <Pressable onPress={() => setFilters(EMPTY_FILTERS)} style={styles.activeFilterChip}>
            <MaterialCommunityIcons name="close-circle" size={14} color={colors.orangeBright} />
            <Text style={styles.activeFilterText}>Filters active — tap to clear</Text>
          </Pressable>
        ) : null}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.orange}
            />
          }
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
              savePending={pendingIds.has(item.id)}
              onToggleSave={() => handleToggleSave(item.id)}
              onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
            />
          )}
        />
      ) : (
        <FlatList
          data={completedItems}
          keyExtractor={(item) => item.completionId}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.orange}
            />
          }
          ListHeaderComponent={
            <SectionPill label="Completed Lore" count={completedItems.length} />
          }
          ListEmptyComponent={
            completionsLoading ? (
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

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        value={filters}
        onApply={setFilters}
      />

      <CenterToast toast={toast} />
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
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: spacing.md,
  },
  activeFilterText: {
    color: colors.orangeBright,
    fontSize: 11,
    marginLeft: 4,
    ...fonts.heading,
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
