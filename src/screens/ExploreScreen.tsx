import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCarouselCard from '../components/ActivityCarouselCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import { useActivities } from '../hooks/useActivities';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Explore'>;

export default function ExploreScreen({ navigation }: Props) {
  const { savedIds, toggleSaved } = useSaved();
  const { activities, loading, error } = useActivities();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter((activity) => {
      const haystack = [
        activity.title,
        activity.blurb,
        activity.category,
        ...activity.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activities]);

  const isSearching = query.trim().length > 0;

  const handleSurpriseMe = () => {
    if (activities.length === 0) return;
    const pick = activities[Math.floor(Math.random() * activities.length)];
    navigation.navigate('ActivityDetail', { activityId: pick.id });
  };

  const handleBoldSurprise = () => {
    const boldOnes = activities.filter((a) => a.difficulty === 'Bold');
    const pool = boldOnes.length > 0 ? boldOnes : activities;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigation.navigate('ActivityDetail', { activityId: pick.id });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.paddedTop}>
          <TopBar
            loreBalance={1240}
            searchPlaceholder="Search activities, sidequests..."
            searchValue={query}
            onSearchChange={setQuery}
          />
          <PillHeader title="EXPLORE" />
        </View>

        <View style={styles.paddedTop}>
          <SectionPill
            label={isSearching ? `Results for "${query.trim()}"` : 'Nearby'}
            count={filtered.length}
          />
        </View>

        {loading ? (
          <View style={[styles.emptyCarousel, styles.paddedTop]}>
            <ActivityIndicator color={colors.orange} />
          </View>
        ) : error ? (
          <View style={[styles.emptyCarousel, styles.paddedTop]}>
            <Text style={styles.emptyText}>Couldn't load lore: {error}</Text>
          </View>
        ) : filtered.length > 0 ? (
          <FlatList
            horizontal
            data={filtered}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <ActivityCarouselCard
                activity={item}
                saved={savedIds.has(item.id)}
                onToggleSave={() => toggleSaved(item.id)}
                onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
              />
            )}
          />
        ) : (
          <View style={[styles.emptyCarousel, styles.paddedTop]}>
            <Text style={styles.emptyText}>No lore matches that search. Try something else.</Text>
          </View>
        )}

        <View style={styles.quickActionRow}>
          <View style={styles.quickActionSpacer} />
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
          <Text style={styles.fabLabel}>Surprise Me</Text>
          <View style={styles.quickActionSpacer} />
          <Pressable
            onPress={handleBoldSurprise}
            disabled={activities.length === 0}
            style={({ pressed }) => [
              styles.viewAllBox,
              shadow.soft,
              (activities.length === 0 || pressed) && styles.fabPressed,
            ]}
          >
            <MaterialCommunityIcons name="fire" size={18} color={colors.orange} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  paddedTop: {
    paddingHorizontal: spacing.lg,
  },
  carouselContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xl,
  },
  quickActionSpacer: {
    flex: 1,
  },
  fab: {
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
  fabLabel: {
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 10.5,
    ...fonts.label,
  },
  viewAllBox: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCarousel: {
    paddingVertical: spacing.lg,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 12.5,
  },
});
