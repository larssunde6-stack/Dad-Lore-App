import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCard from '../components/ActivityCard';
import CompletedLoreCard from '../components/CompletedLoreCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import SegmentedControl from '../components/SegmentedControl';
import { activities } from '../data/activities';
import { completedLore } from '../data/completedLore';
import { colors, fonts, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Segment = 'To Do' | 'Completed';

type Props = TabScreenProps<'Lore'>;

export default function LoreScreen({ navigation }: Props) {
  const [segment, setSegment] = useState<Segment>('To Do');
  const { savedIds, toggleSaved } = useSaved();
  const savedActivities = activities.filter((a) => savedIds.has(a.id));

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
            <View style={styles.empty}>
              <MaterialCommunityIcons name="bookmark-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No lore saved yet</Text>
              <Text style={styles.emptyBody}>
                Tap the bookmark on any lore listing to keep it here for later.
              </Text>
            </View>
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
          data={completedLore}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <SectionPill label="Your Private Diary" count={completedLore.length} />
              <Text style={styles.privacyNote}>
                Only you can see this. Nobody else's completed lore shows up here either.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="notebook-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No lore logged yet</Text>
              <Text style={styles.emptyBody}>
                Once you've done something worth remembering, log it here.
              </Text>
            </View>
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
