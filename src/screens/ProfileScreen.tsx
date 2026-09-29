import React, { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text, TextInput } from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScrollToTop } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { StatCardSkeletonRow } from '../components/Skeleton';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import AccessibilityStatement from '../components/AccessibilityStatement';
import CenterToast, { ToastState } from '../components/CenterToast';
import { useActivities } from '../context/ActivitiesContext';
import { useCompletions } from '../context/CompletionsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Activity } from '../data/activities';
import { getLevel, getRank } from '../utils/level';
import LevelRing from '../components/LevelRing';
import RankText from '../components/RankText';
import { colors, fonts, gradients, radii, scrollPhysics, shadow, spacing } from '../theme/theme';
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
  { label: 'Privacy & Terms', icon: 'shield-check-outline' as const, route: 'Legal' as const },
  { label: 'Help & Support', icon: 'help-circle-outline' as const, route: null },
];

const USERNAME_RE = /^[a-zA-Z0-9_]{2,24}$/;

export default function ProfileScreen({ navigation }: TabScreenProps<'Profile'>) {
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const { activities, refetch: refetchActivities } = useActivities();
  const { completions, xp: lorePoints, loading: statsLoading, refetch: refetchCompletions } =
    useCompletions();
  const { isAnonymous, email, username, userId, logOut, deleteAccount, updateUsername } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [testingLevelUp, setTestingLevelUp] = useState(false);

  const showToast = (next: ToastState) => {
    setToast(next);
    setTimeout(() => setToast(null), 2200);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchActivities(), refetchCompletions()]);
    setRefreshing(false);
  };

  const handleMenuPress = (item: (typeof menuItems)[number]) => {
    if (item.route === 'Legal') {
      navigation.navigate('Legal');
      return;
    }
    showToast({ message: `${item.label} is coming soon`, tone: 'success' });
  };

  const handleLogOut = async () => {
    setLoggingOut(true);
    const result = await logOut();
    setLoggingOut(false);

    if (result.status === 'error') {
      showToast({ message: result.message, tone: 'error' });
      return;
    }

    showToast({ message: 'Logged out', tone: 'success' });
  };

  const confirmDeleteAccount = async () => {
    setDeletingAccount(true);
    const result = await deleteAccount();
    setDeletingAccount(false);

    if (result.status === 'error') {
      showToast({ message: result.message, tone: 'error' });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your account and everything tied to it — saved lore, completed lore, and XP. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDeleteAccount },
      ]
    );
  };

  const handleStartEditUsername = () => {
    setUsernameDraft(username ?? '');
    setEditingUsername(true);
  };

  const handleCancelEditUsername = () => {
    setEditingUsername(false);
  };

  const handleSaveUsername = async () => {
    if (!USERNAME_RE.test(usernameDraft.trim())) {
      showToast({
        message: 'Username must be 2-24 characters (letters, numbers, underscores).',
        tone: 'error',
      });
      return;
    }

    setSavingUsername(true);
    const result = await updateUsername(usernameDraft.trim());
    setSavingUsername(false);

    if (result.status === 'error') {
      showToast({ message: result.message, tone: 'error' });
      return;
    }

    setEditingUsername(false);
    showToast({ message: 'Username updated', tone: 'success' });
  };

  const completedActivities = completions
    .map((entry) => activities.find((a) => a.id === entry.activityId))
    .filter((activity): activity is Activity => Boolean(activity));

  const activitiesDone = completions.length;
  const earnedBadgeCount = badgeDefs.filter((b) => b.earned(completedActivities)).length;

  const { level, progressPct, pointsToNext } = getLevel(lorePoints);
  const rank = getRank(level);

  const handleTestLevelUp = async () => {
    if (testingLevelUp || !userId) return;
    setTestingLevelUp(true);

    // Create fresh, hidden test activities (never depletes the real catalog,
    // never shows up in anyone's real Explore feed) and immediately complete
    // them, so the real level-up detection in CompletionsContext fires
    // through the actual insert -> refetch pipeline.
    const activitiesNeeded = Math.max(1, Math.ceil(pointsToNext / 100));
    const stamp = Date.now();
    const draftActivities = Array.from({ length: activitiesNeeded }).map((_, i) => ({
      title: `Test Level-Up Activity ${stamp}-${i}`,
      icon: 'flask-outline',
      blurb: 'Auto-generated by the TEST: LEVEL UP dev button to exercise the real level-up flow.',
      duration: '5 min',
      lore_rating: 5,
      risk_level: 'green',
      kind: ['Skill'],
      fun_type: 'Type 1',
      tags: ['test'],
      created_by: userId,
      created_by_username: username ?? email ?? 'Guest',
      hidden: true,
    }));

    const { data: created, error: createError } = await supabase
      .from('activities')
      .insert(draftActivities)
      .select();

    if (createError || !created) {
      setTestingLevelUp(false);
      showToast({ message: `Couldn't create test activities: ${createError?.message ?? 'Unknown error'}`, tone: 'error' });
      return;
    }

    const { error: completeError } = await supabase.from('activity_completions').upsert(
      created.map((activity) => ({
        user_id: userId,
        activity_id: activity.id,
        xp_earned: activity.lore_rating * 20,
      })),
      { onConflict: 'user_id,activity_id' }
    );

    setTestingLevelUp(false);

    if (completeError) {
      showToast({ message: completeError.message, tone: 'error' });
      return;
    }

    await refetchCompletions();
  };

  const stats = [
    { label: 'Lore Points', value: lorePoints.toLocaleString(), icon: 'fire' as const },
    { label: 'Activities Done', value: String(activitiesDone), icon: 'check-decagram' as const },
    { label: 'Badges Earned', value: String(earnedBadgeCount), icon: 'medal' as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        decelerationRate={scrollPhysics.decelerationRate}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.orange} />
        }
      >
        <TopBar
          xp={lorePoints}
          showSearch={false}
          onNotificationsPress={() => showToast({ message: 'Notifications coming soon', tone: 'success' })}
        />
        <PillHeader title="PROFILE" showFilter={false} gradient />

        <View style={styles.profileHeader}>
          <View style={styles.ringWrap}>
            <LevelRing size={112} strokeWidth={6} progressPct={progressPct}>
              <LinearGradient
                colors={gradients.icon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.avatar, shadow.soft]}
              >
                <MaterialCommunityIcons name="account" size={38} color={colors.orange} />
              </LinearGradient>
            </LevelRing>
          </View>
          {editingUsername ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={styles.nameInput}
                value={usernameDraft}
                onChangeText={setUsernameDraft}
                placeholder="Username"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={24}
                autoFocus
              />
              {savingUsername ? (
                <ActivityIndicator size="small" color={colors.orange} style={styles.nameEditIcon} />
              ) : (
                <>
                  <Pressable onPress={handleSaveUsername} hitSlop={8} style={styles.nameEditIcon}>
                    <MaterialCommunityIcons name="check" size={18} color={colors.orangeBright} />
                  </Pressable>
                  <Pressable onPress={handleCancelEditUsername} hitSlop={8} style={styles.nameEditIcon}>
                    <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
                  </Pressable>
                </>
              )}
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.name}>{isAnonymous ? 'Guest' : username ?? email ?? 'Account'}</Text>
              {!isAnonymous ? (
                <Pressable onPress={handleStartEditUsername} hitSlop={8} style={styles.nameEditIcon}>
                  <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
          )}
          <View style={styles.subtitleRow}>
            <RankText rank={rank} style={styles.subtitle} />
            <Text style={styles.subtitle}> · Level {level}</Text>
          </View>
          <Text style={styles.progressLabel}>{pointsToNext} lore points to Level {level + 1}</Text>
          {__DEV__ ? (
            <Pressable
              onPress={handleTestLevelUp}
              disabled={testingLevelUp}
              hitSlop={8}
              style={({ pressed }) => [styles.devButton, (pressed || testingLevelUp) && styles.pressedFaint]}
            >
              {testingLevelUp ? (
                <ActivityIndicator size="small" color={colors.textMuted} />
              ) : (
                <Text style={styles.devButtonText}>TEST: LEVEL UP</Text>
              )}
            </Pressable>
          ) : null}
        </View>

        {isAnonymous ? (
          <View style={styles.accountCard}>
            <MaterialCommunityIcons name="account-plus-outline" size={20} color={colors.orangeBright} />
            <View style={styles.accountCardText}>
              <Text style={styles.accountCardTitle}>Save your progress</Text>
              <Text style={styles.accountCardBody}>
                Create a free account to keep your lore, saves, and XP across devices.
              </Text>
            </View>
            <PrimaryButton
              label="Create Account"
              onPress={() => navigation.navigate('Auth')}
              style={styles.accountCardButton}
            />
          </View>
        ) : !username ? (
          <View style={styles.accountCard}>
            <MaterialCommunityIcons name="account-alert-outline" size={20} color={colors.orangeBright} />
            <View style={styles.accountCardText}>
              <Text style={styles.accountCardTitle}>Finish setting up your profile</Text>
              <Text style={styles.accountCardBody}>
                Your account is ready — you just haven't picked a username yet.
              </Text>
            </View>
            <PrimaryButton
              label="Pick a Username"
              onPress={() => navigation.navigate('WelcomeUsername')}
              style={styles.accountCardButton}
            />
          </View>
        ) : null}

        {statsLoading ? (
          <StatCardSkeletonRow />
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
                <View style={[styles.badgeIcon, shadow.soft]}>
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
              onPress={() => handleMenuPress(item)}
              style={({ pressed }) => [
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuDivider,
                pressed && styles.menuItemPressed,
              ]}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons name={item.icon} size={19} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {!isAnonymous ? (
          <>
            <PrimaryButton
              label="Log Out"
              icon="logout"
              variant="outline"
              onPress={handleLogOut}
              loading={loggingOut}
              style={styles.logoutButton}
            />
            <Pressable
              onPress={handleDeleteAccount}
              disabled={deletingAccount}
              hitSlop={8}
              style={({ pressed }) => [
                styles.deleteAccountLink,
                (pressed || deletingAccount) && styles.pressedFaint,
              ]}
            >
              {deletingAccount ? (
                <ActivityIndicator size="small" color={colors.textMuted} />
              ) : (
                <Text style={styles.deleteAccountText}>Delete Account</Text>
              )}
            </Pressable>
          </>
        ) : null}

        <AccessibilityStatement />
      </ScrollView>

      <CenterToast toast={toast} />
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
  ringWrap: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 20,
    ...fonts.display,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  nameInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    ...fonts.heading,
  },
  nameEditIcon: {
    marginLeft: spacing.sm,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: 11.5,
    marginTop: spacing.xs,
  },
  devButton: {
    marginTop: spacing.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  devButtonText: {
    color: colors.textMuted,
    fontSize: 10.5,
    ...fonts.label,
  },
  accountCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  accountCardText: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  accountCardTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    ...fonts.heading,
    marginBottom: spacing.xs,
  },
  accountCardBody: {
    color: colors.textSecondary,
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  accountCardButton: {
    alignSelf: 'stretch',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
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
  menuItemPressed: {
    backgroundColor: colors.backgroundAlt,
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
  deleteAccountLink: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    padding: spacing.xs,
  },
  deleteAccountText: {
    color: colors.textMuted,
    fontSize: 12.5,
    textDecorationLine: 'underline',
  },
  pressedFaint: {
    opacity: 0.6,
  },
});
