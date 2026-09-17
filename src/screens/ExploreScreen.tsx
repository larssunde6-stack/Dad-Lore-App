import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityCard from '../components/ActivityCard';
import CategoryChip from '../components/CategoryChip';
import SearchBar from '../components/SearchBar';
import { activities, categories, Category } from '../data/activities';
import { colors, fonts, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Explore'>;

export default function ExploreScreen({ navigation }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const { savedIds, toggleSaved } = useSaved();

  const filtered = activeCategory
    ? activities.filter((a) => a.category === activeCategory)
    : activities;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>Good Afternoon, Dad</Text>
              <Text style={styles.title}>Find Your Next{'\n'}Dad Lore Moment</Text>
            </View>

            <SearchBar placeholder="Search activities near you..." />

            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item.label}
              showsHorizontalScrollIndicator={false}
              style={styles.categoryList}
              contentContainerStyle={styles.categoryListContent}
              renderItem={({ item }) => (
                <CategoryChip
                  label={item.label}
                  icon={item.icon as any}
                  active={activeCategory === item.label}
                  onPress={() =>
                    setActiveCategory((prev) => (prev === item.label ? null : item.label))
                  }
                />
              )}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeCategory ? activeCategory : 'All Activities'}
              </Text>
              <Text style={styles.sectionCount}>{filtered.length} nearby</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            saved={savedIds.has(item.id)}
            onToggleSave={() => toggleSaved(item.id)}
            onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
          />
        )}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.orangeBright,
    fontSize: 12,
    ...fonts.label,
    marginBottom: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    ...fonts.display,
    lineHeight: 34,
  },
  categoryList: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  categoryListContent: {
    paddingRight: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    ...fonts.heading,
  },
  sectionCount: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
