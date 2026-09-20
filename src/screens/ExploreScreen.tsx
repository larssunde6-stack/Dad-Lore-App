import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCarouselCard from '../components/ActivityCarouselCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import FilterModal, { ActivityFilters, EMPTY_FILTERS, isFiltersEmpty } from '../components/FilterModal';
import { useActivities } from '../hooks/useActivities';
import { useCompletions } from '../hooks/useCompletions';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Explore'>;

export default function ExploreScreen({ navigation }: Props) {
  const { savedIds, toggleSaved } = useSaved();
  const { activities, loading, error } = useActivities();
  const { xp } = useCompletions();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ActivityFilters>(EMPTY_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities.filter((activity) => {
      if (filters.risk.length > 0 && !filters.risk.includes(activity.riskLevel)) return false;
      if (filters.kind.length > 0 && !filters.kind.includes(activity.kind)) return false;
      if (filters.funType.length > 0 && !filters.funType.includes(activity.funType)) return false;

      if (!q) return true;
      const haystack = [activity.title, activity.blurb, ...activity.tags].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query, filters, activities]);

  const isSearching = query.trim().length > 0;
  const filtersActive = !isFiltersEmpty(filters);

  const handleSurpriseMe = () => {
    if (activities.length === 0) return;
    const pick = activities[Math.floor(Math.random() * activities.length)];
    navigation.navigate('ActivityDetail', { activityId: pick.id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={loading || error ? [] : filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.paddedTop}>
            <TopBar
              xp={xp}
              searchPlaceholder="Search activities, sidequests..."
              searchValue={query}
              onSearchChange={setQuery}
              onProfilePress={() => navigation.navigate('Profile')}
            />
            <PillHeader title="EXPLORE" onFilterPress={() => setFilterModalVisible(true)} />
            {filtersActive ? (
              <Pressable onPress={() => setFilters(EMPTY_FILTERS)} style={styles.activeFilterChip}>
                <MaterialCommunityIcons name="close-circle" size={14} color={colors.orangeBright} />
                <Text style={styles.activeFilterText}>Filters active — tap to clear</Text>
              </Pressable>
            ) : null}
            <SectionPill
              label={isSearching ? `Results for "${query.trim()}"` : 'All Lore'}
              count={filtered.length}
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={[styles.emptyState, styles.paddedTop]}>
              <ActivityIndicator color={colors.orange} />
            </View>
          ) : error ? (
            <View style={[styles.emptyState, styles.paddedTop]}>
              <Text style={styles.emptyText}>Couldn't load lore: {error}</Text>
            </View>
          ) : (
            <View style={[styles.emptyState, styles.paddedTop]}>
              <Text style={styles.emptyText}>No lore matches. Try a different search or filter.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.paddedTop}>
            <ActivityCarouselCard
              activity={item}
              saved={savedIds.has(item.id)}
              onToggleSave={() => toggleSaved(item.id)}
              onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
            />
          </View>
        )}
        ListFooterComponent={<View style={styles.footerSpace} />}
      />

      <Pressable
        onPress={handleSurpriseMe}
        disabled={activities.length === 0}
        style={({ pressed }) => [
          styles.fab,
          shadow.glow,
          (activities.length === 0 || pressed) && styles.fabPressed,
        ]}
      >
        <MaterialCommunityIcons name="dice-multiple-outline" size={26} color={colors.textOnOrange} />
      </Pressable>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        value={filters}
        onApply={setFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  paddedTop: {
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  activeFilterText: {
    color: colors.orangeBright,
    fontSize: 11.5,
    marginLeft: 5,
    ...fonts.heading,
  },
  emptyState: {
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 12.5,
  },
  footerSpace: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: {
    opacity: 0.6,
  },
});
