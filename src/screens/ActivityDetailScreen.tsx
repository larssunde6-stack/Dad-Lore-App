import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import ReportModal from '../components/ReportModal';
import CenterToast, { ToastState } from '../components/CenterToast';
import { useActivities } from '../hooks/useActivities';
import { useCompletions } from '../hooks/useCompletions';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { RootStackScreenProps } from '../navigation/types';

const riskColor: Record<string, string> = {
  green: colors.riskGreen,
  yellow: colors.riskYellow,
  red: colors.riskRed,
};

const riskBg: Record<string, string> = {
  green: colors.riskGreenBg,
  yellow: colors.riskYellowBg,
  red: colors.riskRedBg,
};

const riskLabel: Record<string, string> = {
  green: 'Low Risk',
  yellow: 'Medium Risk',
  red: 'High Risk',
};

export default function ActivityDetailScreen({ route, navigation }: RootStackScreenProps<'ActivityDetail'>) {
  const { activityId } = route.params;
  const { activities, loading, error } = useActivities();
  const { savedIds, pendingIds, toggleSaved } = useSaved();
  const { completions, refetch: refetchCompletions } = useCompletions();
  const { userId, isReady, authError } = useAuth();
  const [reportVisible, setReportVisible] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (next: ToastState) => {
    setToast(next);
    setTimeout(() => setToast(null), 2200);
  };

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
  const savePending = pendingIds.has(activity.id);
  const isCompleted = completions.some((c) => c.activityId === activity.id);

  const handleToggleComplete = async () => {
    if (isCompleting) return;

    if (!userId) {
      const message =
        isReady && authError
          ? `Not signed in: ${authError}`
          : 'Still signing you in — try again in a moment.';
      showToast({ message, tone: 'error' });
      return;
    }

    setIsCompleting(true);

    if (isCompleted) {
      const { error: deleteError } = await supabase
        .from('activity_completions')
        .delete()
        .eq('user_id', userId)
        .eq('activity_id', activity.id);

      setIsCompleting(false);

      if (deleteError) {
        showToast({ message: `Couldn't undo that: ${deleteError.message}`, tone: 'error' });
        return;
      }

      await refetchCompletions();
      showToast({ message: 'Removed from Your Lore', tone: 'success' });
      return;
    }

    const xp = activity.loreRating * 20;
    const { error: insertError } = await supabase
      .from('activity_completions')
      .upsert(
        { user_id: userId, activity_id: activity.id, xp_earned: xp },
        { onConflict: 'user_id,activity_id' }
      );

    setIsCompleting(false);

    if (insertError) {
      showToast({ message: `Couldn't log that: ${insertError.message}`, tone: 'error' });
      return;
    }

    await refetchCompletions();
    showToast({ message: `Marked as Done — Added to Your Lore (+${xp} XP)`, tone: 'success' });
  };

  const handleToggleSave = async () => {
    const result = await toggleSaved(activity.id);
    if (result.status === 'saved') {
      showToast({ message: 'Saved', tone: 'success' });
    } else if (result.status === 'removed') {
      showToast({ message: 'Removed from Saved', tone: 'success' });
    } else {
      showToast({ message: result.message, tone: 'error' });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.heroCard,
            { backgroundColor: riskBg[activity.riskLevel], borderColor: riskColor[activity.riskLevel] },
          ]}
        >
          <View style={styles.heroTop}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.heroRightButtons}>
              <Pressable onPress={() => setReportVisible(true)} style={styles.backButton} hitSlop={10}>
                <MaterialCommunityIcons name="flag-outline" size={18} color={colors.textPrimary} />
              </Pressable>
              <Pressable
                onPress={handleToggleSave}
                disabled={savePending}
                style={[styles.backButton, savePending && styles.backButtonPending]}
                hitSlop={10}
              >
                {savePending ? (
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                ) : (
                  <MaterialCommunityIcons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={saved ? colors.orange : colors.textPrimary}
                  />
                )}
              </Pressable>
            </View>
          </View>

          <LinearGradient
            colors={gradients.icon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroIcon, shadow.soft]}
          >
            <MaterialCommunityIcons name={activity.icon as any} size={46} color={colors.orange} />
          </LinearGradient>
          <View style={styles.tagRow}>
            {activity.kind.map((k) => (
              <View key={k} style={styles.kindTag}>
                <Text style={styles.kindTagText}>{k}</Text>
              </View>
            ))}
            <View style={styles.kindTag}>
              <Text style={styles.kindTagText}>{activity.funType} Fun</Text>
            </View>
          </View>
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
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.orangeBright} />
            <Text style={styles.statValue}>{activity.duration}</Text>
            <Text style={styles.statLabel}>Est. duration</Text>
          </View>
          <View style={[styles.statBox, shadow.soft]}>
            <MaterialCommunityIcons
              name="alert-decagram-outline"
              size={18}
              color={riskColor[activity.riskLevel]}
            />
            <Text style={[styles.statValue, { color: riskColor[activity.riskLevel] }]}>
              {riskLabel[activity.riskLevel]}
            </Text>
            <Text style={styles.statLabel}>Danger Level</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>The Lore</Text>
        <Text style={styles.description}>{activity.blurb}</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton
          label={
            isCompleting
              ? 'Working...'
              : isCompleted
              ? 'Completed — Tap to Undo'
              : 'Mark as Done'
          }
          icon={isCompleted ? 'check-decagram' : 'check-decagram-outline'}
          variant={isCompleted ? 'outline' : 'solid'}
          onPress={handleToggleComplete}
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

      <CenterToast toast={toast} />
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
  backButtonPending: {
    opacity: 0.6,
  },
  heroRightButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  kindTag: {
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: spacing.sm,
  },
  kindTagText: {
    color: colors.orangeBright,
    fontSize: 10.5,
    ...fonts.label,
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
});
