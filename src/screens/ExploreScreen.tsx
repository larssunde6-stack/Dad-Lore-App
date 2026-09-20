import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCarouselCard from '../components/ActivityCarouselCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import FilterModal, { ActivityFilters, EMPTY_FILTERS, isFiltersEmpty } from '../components/FilterModal';
import { useActivities } from '../hooks/useActivities';
import { useCompletions } from '../hooks/useCompletions';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';
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
      if (filters.kind.length > 0 && !filters.kind.some((k) => activity.kind.includes(k))) return false;
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
      <View style={[styles.banner, shadow.soft]}>
        <TopBar
          xp={xp}
          searchPlaceholder="Search activities, sidequests..."
          searchValue={query}
          onSearchChange={setQuery}
          onProfilePress={() => navigation.navigate('Profile')}
        />
      </View>

      <View style={[styles.exploreHeader, shadow.soft]}>
        <PillHeader
          title="EXPLORE"
          onFilterPress={() => setFilterModalVisible(true)}
          countLabel={isSearching ? `${filtered.length} results` : `${filtered.length} total`}
          compact
        />
        {filtersActive ? (
          <Pressable onPress={() => setFilters(EMPTY_FILTERS)} style={styles.activeFilterChip}>
            <MaterialCommunityIcons name="close-circle" size={14} color={colors.orangeBright} />
            <Text style={styles.activeFilterText}>Filters active — tap to clear</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={loading || error ? [] : filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
          styles.fabWrap,
          shadow.glow,
          (activities.length === 0 || pressed) && styles.fabPressed,
        ]}
      >
        <LinearGradient colors={gradients.fab} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
          <MaterialCommunityIcons name="dice-multiple-outline" size={26} color={colors.textOnOrange} />
        </LinearGradient>
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
  banner: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 2,
  },
  exploreHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    zIndex: 1,
  },
  listContent: {
    paddingTop: spacing.md,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: spacing.sm,
  },
  activeFilterText: {
    color: colors.orangeBright,
    fontSize: 11,
    marginLeft: 4,
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
  fabWrap: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: {
    opacity: 0.6,
  },
});
