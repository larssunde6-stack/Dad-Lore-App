import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

const stats = [
  { label: 'Lore Points', value: '1,240', icon: 'fire' as const },
  { label: 'Activities Done', value: '18', icon: 'check-decagram' as const },
  { label: 'Badges Earned', value: '6', icon: 'medal' as const },
];

const badges = [
  { label: 'Fire Starter', icon: 'campfire' as const },
  { label: 'Trail Blazer', icon: 'hiking' as const },
  { label: 'Grill Master', icon: 'food-steak' as const },
  { label: 'Fix-It Pro', icon: 'wrench' as const },
  { label: 'Lake Legend', icon: 'fish' as const },
  { label: 'Road Scholar', icon: 'compass-outline' as const },
];

const menuItems = [
  { label: 'Activity History', icon: 'history' as const },
  { label: 'Notification Settings', icon: 'bell-outline' as const },
  { label: 'Home Location', icon: 'map-marker-outline' as const },
  { label: 'Help & Support', icon: 'help-circle-outline' as const },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={38} color={colors.orange} />
            <View style={styles.avatarRing} />
          </View>
          <Text style={styles.name}>Mike Sundberg</Text>
          <Text style={styles.subtitle}>Level 4 · Weekend Adventurer</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressLabel}>260 lore points to Level 5</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, shadow.soft]}>
              <MaterialCommunityIcons name={stat.icon} size={20} color={colors.orange} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <View key={badge.label} style={styles.badgeItem}>
              <View style={styles.badgeIcon}>
                <MaterialCommunityIcons name={badge.icon} size={22} color={colors.orangeBright} />
              </View>
              <Text style={styles.badgeLabel}>{badge.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <View
              key={item.label}
              style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuDivider]}
            >
              <View style={styles.menuLeft}>
                <MaterialCommunityIcons name={item.icon} size={19} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Log Out"
          icon="logout"
          variant="outline"
          style={styles.logoutButton}
        />
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
    backgroundColor: colors.orangeMuted,
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
