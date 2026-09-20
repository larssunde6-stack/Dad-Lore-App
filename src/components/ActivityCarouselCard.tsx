import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Activity } from '../data/activities';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';

const riskColor: Record<Activity['riskLevel'], string> = {
  green: colors.riskGreen,
  yellow: colors.riskYellow,
  red: colors.riskRed,
};

const riskBg: Record<Activity['riskLevel'], string> = {
  green: colors.riskGreenBg,
  yellow: colors.riskYellowBg,
  red: colors.riskRedBg,
};

type Props = {
  activity: Activity;
  saved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
};

export default function ActivityCarouselCard({ activity, saved, onPress, onToggleSave }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        { backgroundColor: riskBg[activity.riskLevel] },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <LinearGradient
          colors={gradients.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.thumbnail, shadow.soft]}
        >
          <MaterialCommunityIcons name={activity.icon as any} size={32} color={colors.orange} />
        </LinearGradient>
        <View style={styles.kindTag}>
          <Text style={styles.kindTagText}>{activity.kind.join(' · ')}</Text>
        </View>
        <Pressable onPress={onToggleSave} hitSlop={8} style={styles.iconBox}>
          <MaterialCommunityIcons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={17}
            color={saved ? colors.orange : colors.textSecondary}
          />
        </Pressable>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {activity.title}
      </Text>
      <Text style={styles.blurb} numberOfLines={3}>
        {activity.blurb}
      </Text>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statValue}>{activity.duration}</Text>
          <Text style={styles.statLabel}>duration</Text>
        </View>
        <View style={styles.colDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statValue}>{activity.loreRating}/5</Text>
          <Text style={styles.statLabel}>lore pts</Text>
        </View>
        <View style={styles.colDivider} />
        <View style={styles.statCol}>
          <Text style={[styles.statValue, { color: riskColor[activity.riskLevel] }]}>
            {activity.funType}
          </Text>
          <Text style={styles.statLabel}>fun</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindTag: {
    marginLeft: spacing.md,
    flex: 1,
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  kindTagText: {
    color: colors.orangeBright,
    fontSize: 10.5,
    ...fonts.label,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    ...fonts.heading,
    lineHeight: 23,
    marginBottom: spacing.sm,
  },
  blurb: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 13,
    ...fonts.heading,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  colDivider: {
    width: 1,
    height: 26,
    backgroundColor: colors.borderSubtle,
    marginRight: spacing.md,
  },
});
