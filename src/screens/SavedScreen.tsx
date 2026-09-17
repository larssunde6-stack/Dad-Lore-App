import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActivityCard from '../components/ActivityCard';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import SectionPill from '../components/SectionPill';
import { activities } from '../data/activities';
import { colors, fonts, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Saved'>;

export default function SavedScreen({ navigation }: Props) {
  const { savedIds, toggleSaved } = useSaved();
  const savedActivities = activities.filter((a) => savedIds.has(a.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TopBar loreBalance={1240} showSearch={false} />
        <PillHeader title="SAVED" />
        <SectionPill label="Your Legend Log" count={savedActivities.length} />
      </View>

      <FlatList
        data={savedActivities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bookmark-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No lore saved yet</Text>
            <Text style={styles.emptyBody}>
              Tap the bookmark on any activity to keep it here for later.
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
