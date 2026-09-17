import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Activity } from '../data/activities';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

const difficultyColor: Record<Activity['difficulty'], string> = {
  Easy: '#7CB88F',
  Moderate: '#FFB347',
  Bold: '#FF6A1F',
};

type Props = {
  activity: Activity;
  saved?: boolean;
  onPress?: () => void;
  onToggleSave?: () => void;
};

export default function ActivityCarouselCard({ activity, saved, onPress, onToggleSave }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed]}>
      <View style={styles.thumbnail}>
        <MaterialCommunityIcons name={activity.icon as any} size={40} color={colors.orange} />
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagText}>{activity.category}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {activity.title}
        </Text>

        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {activity.location} · {activity.duration}
          </Text>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="fire" size={12} color={colors.orange} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{activity.distance.split(' ')[0]}</Text>
            <Text style={styles.statLabel}>mi away</Text>
          </View>
          <View style={styles.colDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{activity.loreRating}/5</Text>
            <Text style={styles.statLabel}>lore pts</Text>
          </View>
          <View style={styles.colDivider} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: difficultyColor[activity.difficulty] }]}>
              {activity.difficulty}
            </Text>
            <Text style={styles.statLabel}>level</Text>
          </View>

          <Pressable onPress={onToggleSave} hitSlop={8} style={styles.iconBox}>
            <MaterialCommunityIcons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={17}
              color={saved ? colors.orange : colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const CARD_WIDTH = 252;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  thumbnail: {
    height: 96,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  categoryTagText: {
    color: colors.orangeBright,
    fontSize: 9.5,
    ...fonts.label,
  },
  body: {
    padding: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    ...fonts.heading,
    lineHeight: 18,
    minHeight: 36,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 11.5,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.sm,
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
    fontSize: 12.5,
    ...fonts.heading,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9.5,
    marginTop: 1,
  },
  colDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.borderSubtle,
    marginRight: spacing.sm,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
