import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCarouselCard from '../components/ActivityCarouselCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import { activities } from '../data/activities';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Explore'>;

export default function ExploreScreen({ navigation }: Props) {
  const { savedIds, toggleSaved } = useSaved();
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
  }, [query]);

  const isSearching = query.trim().length > 0;

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

        {filtered.length > 0 ? (
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
          <Pressable style={[styles.fab, shadow.glow]}>
            <MaterialCommunityIcons name="dice-multiple-outline" size={26} color={colors.textOnOrange} />
          </Pressable>
          <Text style={styles.fabLabel}>Surprise Me</Text>
          <View style={styles.quickActionSpacer} />
          <Pressable style={[styles.viewAllBox, shadow.soft]}>
            <MaterialCommunityIcons name="view-grid-outline" size={18} color={colors.orange} />
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
