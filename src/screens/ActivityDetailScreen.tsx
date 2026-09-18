import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import ReportModal from '../components/ReportModal';
import { useActivities } from '../hooks/useActivities';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { RootStackScreenProps } from '../navigation/types';

const difficultyColor: Record<string, string> = {
  Easy: '#7CB88F',
  Moderate: '#FFB347',
  Bold: '#FF6A1F',
};

export default function ActivityDetailScreen({ route, navigation }: RootStackScreenProps<'ActivityDetail'>) {
  const { activityId } = route.params;
  const { activities, loading, error } = useActivities();
  const { savedIds, toggleSaved } = useSaved();
  const { userId } = useAuth();
  const [reportVisible, setReportVisible] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ xp: number } | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredSafe} edges={['top']}>
        <ActivityIndicator color={colors.orange} />
      </SafeAreaView>
    );
  }

  const activity = activities.find((a) => a.id === activityId);

  if (error || !activity) {
    return (
      <SafeAreaView style={styles.centeredSafe} edges={['top']}>
        <Text style={styles.errorText}>
          {error ? `Couldn't load lore: ${error}` : "That lore couldn't be found."}
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
      </SafeAreaView>
    );
  }

  const saved = savedIds.has(activity.id);

  const handleMarkAsDone = async () => {
    if (isCompleting || !userId) return;
    setIsCompleting(true);
    setCompleteError(null);

    const xp = activity.loreRating * 20;
    const { error: insertError } = await supabase.from('activity_completions').insert({
      user_id: userId,
      activity_id: activity.id,
      xp_earned: xp,
    });

    setIsCompleting(false);

    if (insertError) {
      setCompleteError(insertError.message);
      return;
    }

    setConfirmation({ xp });
    setTimeout(() => setConfirmation(null), 2500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.heroRightButtons}>
              <Pressable onPress={() => setReportVisible(true)} style={styles.backButton} hitSlop={10}>
                <MaterialCommunityIcons name="flag-outline" size={18} color={colors.textPrimary} />
              </Pressable>
              <Pressable onPress={() => toggleSaved(activity.id)} style={styles.backButton} hitSlop={10}>
                <MaterialCommunityIcons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={saved ? colors.orange : colors.textPrimary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name={activity.icon as any} size={46} color={colors.orange} />
          </View>
          <Text style={styles.category}>{activity.category}</Text>
          <Text style={styles.title}>{activity.title}</Text>

          <View style={styles.loreRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MaterialCommunityIcons
                key={i}
                name="fire"
                size={16}
                color={i < activity.loreRating ? colors.orange : 'rgba(255,255,255,0.15)'}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.loreLabel}>Lore Rating</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, shadow.soft]}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.orangeBright} />
            <Text style={styles.statValue}>{activity.distance}</Text>
            <Text style={styles.statLabel}>{activity.location}</Text>
          </View>
          <View style={[styles.statBox, shadow.soft]}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.orangeBright} />
            <Text style={styles.statValue}>{activity.duration}</Text>
            <Text style={styles.statLabel}>Est. duration</Text>
          </View>
          <View style={[styles.statBox, shadow.soft]}>
            <MaterialCommunityIcons name="chart-line" size={18} color={colors.orangeBright} />
            <Text style={[styles.statValue, { color: difficultyColor[activity.difficulty] }]}>
              {activity.difficulty}
            </Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>The Lore</Text>
        <Text style={styles.description}>
          {activity.blurb} This is placeholder detail copy describing what makes this activity
          worthy of future dad lore — the setup, the moment it goes sideways, and the retelling
          that somehow gets better every time you tell it.
        </Text>

        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsWrap}>
          {activity.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>What You'll Need</Text>
        <View style={styles.checklist}>
          {['A good attitude', 'Weather-ready gear', 'A story-worthy mindset'].map((item) => (
            <View key={item} style={styles.checklistItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={colors.orange} />
              <Text style={styles.checklistText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {confirmation ? (
          <View style={styles.confirmationBanner}>
            <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
            <Text style={styles.confirmationText}>
              +{confirmation.xp} XP · Added to Your Lore
            </Text>
          </View>
        ) : null}
        {completeError ? (
          <Text style={styles.completeErrorText}>Couldn't log that: {completeError}</Text>
        ) : null}
        <PrimaryButton
          label={isCompleting ? 'Marking as Done...' : 'Mark as Done'}
          icon="check-decagram-outline"
          onPress={handleMarkAsDone}
          disabled={isCompleting}
          style={styles.ctaButton}
        />
      </View>

      <ReportModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        activityId={activity.id}
        activityTitle={activity.title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredSafe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  content: {
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRightButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: radii.lg,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  category: {
    color: colors.orangeBright,
    fontSize: 12,
    ...fonts.label,
    marginBottom: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    ...fonts.display,
    lineHeight: 30,
    marginBottom: spacing.md,
  },
  loreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loreLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 13,
    ...fonts.heading,
    marginTop: 6,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  checklist: {
    paddingHorizontal: spacing.lg,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checklistText: {
    color: colors.textSecondary,
    fontSize: 13.5,
    marginLeft: spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  ctaButton: {
    width: '100%',
  },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    paddingVertical: 8,
    marginBottom: spacing.sm,
  },
  confirmationText: {
    color: colors.success,
    fontSize: 13,
    marginLeft: 6,
    ...fonts.heading,
  },
  completeErrorText: {
    color: '#E6807A',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
