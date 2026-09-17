import React from 'react';
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
  const savedActivities = activities.filter((a) => savedIds.has(a.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paddedTop}>
          <TopBar loreBalance={1240} searchPlaceholder="Search activities near you..." />
          <PillHeader title="EXPLORE" />
        </View>

        <View style={styles.paddedTop}>
          <SectionPill label="Nearby" count={activities.length} />
        </View>
        <FlatList
          horizontal
          data={activities}
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

        <View style={styles.paddedTop}>
          <SectionPill label="Saved" count={savedActivities.length} />
        </View>
        {savedActivities.length > 0 ? (
          <FlatList
            horizontal
            data={savedActivities}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <ActivityCarouselCard
                activity={item}
                saved
                onToggleSave={() => toggleSaved(item.id)}
                onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
              />
            )}
          />
        ) : (
          <View style={[styles.emptyCarousel, styles.paddedTop]}>
            <Text style={styles.emptyText}>Bookmark an activity to see it here.</Text>
          </View>
        )}
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
