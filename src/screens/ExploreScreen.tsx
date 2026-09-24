import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScrollToTop } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCarouselCard from '../components/ActivityCarouselCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import FilterModal, {
  ActivityFilters,
  EMPTY_FILTERS,
  isFiltersEmpty,
  matchesFilters,
} from '../components/FilterModal';
import CenterToast, { ToastState } from '../components/CenterToast';
import { useActivities } from '../context/ActivitiesContext';
import { useCompletions } from '../context/CompletionsContext';
import { colors, fonts, gradients, radii, scrollPhysics, shadow, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Explore'>;

type AnimatedFabProps = {
  onPress: () => void;
  disabled?: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  positionStyle?: ViewStyle;
};

function AnimatedFab({ onPress, disabled, icon, positionStyle }: AnimatedFabProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.fabWrap,
        positionStyle,
        shadow.glow,
        disabled && styles.fabDisabled,
        { transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.92)}
        onPressOut={() => animateTo(1)}
        disabled={disabled}
      >
        <LinearGradient colors={gradients.fab} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fab}>
          <MaterialCommunityIcons name={icon} size={26} color={colors.textOnOrange} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function ExploreScreen({ navigation }: Props) {
  const listRef = useRef<FlatList<any>>(null);
  useScrollToTop(listRef);
  const { savedIds, pendingIds, toggleSaved } = useSaved();
  const { activities, loading, error, refetch: refetchActivities } = useActivities();
  const { xp, refetch: refetchCompletions } = useCompletions();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ActivityFilters>(EMPTY_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchActivities(), refetchCompletions()]);
    setRefreshing(false);
  };

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activities.filter((activity) => {
      if (!matchesFilters(activity, filters)) return false;

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
      <View style={styles.banner}>
        <TopBar
          xp={xp}
          searchPlaceholder="Search activities, sidequests..."
          searchValue={query}
          onSearchChange={setQuery}
        />
      </View>

      <View style={styles.listWrap}>
        <FlatList
          ref={listRef}
          data={loading || error ? [] : filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          decelerationRate={scrollPhysics.decelerationRate}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.orange} />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <PillHeader
                title="EXPLORE"
                onFilterPress={() => setFilterModalVisible(true)}
                countLabel={isSearching ? `${filtered.length} results` : `${filtered.length} total`}
                compact
                gradient
              />
              {filtersActive ? (
                <Pressable onPress={() => setFilters(EMPTY_FILTERS)} style={styles.activeFilterChip}>
                  <MaterialCommunityIcons name="close-circle" size={14} color={colors.orangeBright} />
                  <Text style={styles.activeFilterText}>Filters active — tap to clear</Text>
                </Pressable>
              ) : null}
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
                savePending={pendingIds.has(item.id)}
                onToggleSave={() => handleToggleSave(item.id)}
                onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
              />
            </View>
          )}
          ListFooterComponent={<View style={styles.footerSpace} />}
        />
      </View>

      <AnimatedFab
        onPress={() => navigation.navigate('CreateActivity')}
        icon="plus"
        positionStyle={styles.createFabWrap}
      />

      <AnimatedFab
        onPress={handleSurpriseMe}
        disabled={activities.length === 0}
        icon="dice-multiple-outline"
      />

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
  banner: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  listWrap: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
  createFabWrap: {
    bottom: spacing.xl + 60 + spacing.md,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabDisabled: {
    opacity: 0.5,
  },
});
