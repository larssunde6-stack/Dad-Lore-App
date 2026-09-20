import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import AccessibilityStatement from '../components/AccessibilityStatement';
import { useActivities } from '../hooks/useActivities';
import { useCompletions } from '../hooks/useCompletions';
import { Activity } from '../data/activities';
import { getLevel } from '../utils/level';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';
import { TabScreenProps } from '../navigation/types';

type BadgeDef = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  earned: (completed: Activity[]) => boolean;
};

const badgeDefs: BadgeDef[] = [
  {
    label: 'Skill Builder',
    icon: 'school-outline',
    earned: (c) => c.filter((a) => a.kind.includes('Skill')).length >= 3,
  },
  {
    label: 'Fun Seeker',
    icon: 'emoticon-excited-outline',
    earned: (c) => c.filter((a) => a.kind.includes('Fun')).length >= 3,
  },
  {
    label: 'Type 1 Fanatic',
    icon: 'lightning-bolt-outline',
    earned: (c) => c.filter((a) => a.funType === 'Type 1').length >= 3,
  },
  {
    label: 'Type 2 Legend',
    icon: 'trophy-outline',
    earned: (c) => c.filter((a) => a.funType === 'Type 2').length >= 3,
  },
  {
    label: 'Green Zone',
    icon: 'shield-check-outline',
    earned: (c) => c.some((a) => a.riskLevel === 'green'),
  },
  {
    label: 'Yellow Flag',
    icon: 'alert-outline',
    earned: (c) => c.some((a) => a.riskLevel === 'yellow'),
  },
  {
    label: 'Red Alert',
    icon: 'alert-decagram-outline',
    earned: (c) => c.some((a) => a.riskLevel === 'red'),
  },
];

const menuItems = [
  { label: 'Activity History', icon: 'history' as const, route: null },
  { label: 'Notification Settings', icon: 'bell-outline' as const, route: null },
  { label: 'Home Location', icon: 'map-marker-outline' as const, route: null },
  { label: 'Privacy & Terms', icon: 'shield-check-outline' as const, route: 'Legal' as const },
  { label: 'Help & Support', icon: 'help-circle-outline' as const, route: null },
];

export default function ProfileScreen({ navigation }: TabScreenProps<'Profile'>) {
  const { activities } = useActivities();
  const { completions, xp: lorePoints, loading: statsLoading } = useCompletions();

  const completedActivities = completions
    .map((entry) => activities.find((a) => a.id === entry.activityId))
    .filter((activity): activity is Activity => Boolean(activity));

  const activitiesDone = completions.length;
  const earnedBadgeCount = badgeDefs.filter((b) => b.earned(completedActivities)).length;

  const { level, progressPct, pointsToNext } = getLevel(lorePoints);

  const stats = [
    { label: 'Lore Points', value: lorePoints.toLocaleString(), icon: 'fire' as const },
    { label: 'Activities Done', value: String(activitiesDone), icon: 'check-decagram' as const },
    { label: 'Badges Earned', value: String(earnedBadgeCount), icon: 'medal' as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopBar xp={lorePoints} showSearch={false} />
        <PillHeader title="PROFILE" />

        <View style={styles.profileHeader}>
          <LinearGradient
            colors={gradients.icon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.avatar, shadow.soft]}
          >
            <MaterialCommunityIcons name="account" size={38} color={colors.orange} />
            <View style={styles.avatarRing} />
          </LinearGradient>
          <Text style={styles.name}>Jordan Sundberg</Text>
          <Text style={styles.subtitle}>Level {level} · Lore in Progress</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{pointsToNext} lore points to Level {level + 1}</Text>
        </View>

        {statsLoading ? (
          <View style={styles.statsLoading}>
            <ActivityIndicator color={colors.orange} />
          </View>
        ) : (
          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={[styles.statCard, shadow.soft]}>
                <MaterialCommunityIcons name={stat.icon} size={20} color={colors.orange} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgeGrid}>
          {badgeDefs.map((badge) => {
            const earned = badge.earned(completedActivities);
            return (
              <View key={badge.label} style={[styles.badgeItem, !earned && styles.badgeItemLocked]}>
                <View style={styles.badgeIcon}>
                  <MaterialCommunityIcons
                    name={badge.icon}
                    size={22}
                    color={earned ? colors.orangeBright : colors.textMuted}
                  />
                </View>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              disabled={!item.route}
              onPress={() => {
                if (item.route === 'Legal') {
                  navigation.navigate('Legal');
                }
              }}
              style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuDivider]}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons name={item.icon} size={19} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          label="Log Out"
          icon="logout"
          variant="outline"
          style={styles.logoutButton}
        />

        <AccessibilityStatement />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarRing: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: colors.orange,
    opacity: 0.4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 20,
    ...fonts.display,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
  },
  progressFill: {
    width: '68%',
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.orange,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: 11.5,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  statsLoading: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    marginRight: spacing.md,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 18,
    ...fonts.display,
    marginTop: spacing.sm,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10.5,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    marginBottom: spacing.md,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xl,
  },
  badgeItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badgeItemLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  badgeLabel: {
    color: colors.textSecondary,
    fontSize: 10.5,
    textAlign: 'center',
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: spacing.md,
  },
  logoutButton: {
    alignSelf: 'center',
  },
});
