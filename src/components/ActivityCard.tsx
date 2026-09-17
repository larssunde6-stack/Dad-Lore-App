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
  onPress?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
};

export default function ActivityCard({ activity, onPress, saved, onToggleSave }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, shadow.card, pressed && styles.pressed]}>
      <View style={styles.cornerFold} />

      <View style={styles.topRow}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons name={activity.icon as any} size={26} color={colors.orange} />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.category}>{activity.category}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {activity.title}
          </Text>
        </View>

        <Pressable hitSlop={10} onPress={onToggleSave} style={styles.saveButton}>
          <MaterialCommunityIcons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? colors.orange : colors.textMuted}
          />
        </Pressable>
      </View>

      <Text style={styles.blurb}>{activity.blurb}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{activity.distance}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{activity.duration}</Text>
        </View>
        <View style={[styles.difficultyBadge, { borderColor: difficultyColor[activity.difficulty] }]}>
          <Text style={[styles.difficultyText, { color: difficultyColor[activity.difficulty] }]}>
            {activity.difficulty}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.tagsRow}>
          {activity.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.loreRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name="fire"
              size={13}
              color={i < activity.loreRating ? colors.orange : colors.borderSubtle}
              style={{ marginLeft: 1 }}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderTopRightRadius: radii.sm,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  cornerFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 26,
    height: 26,
    backgroundColor: colors.background,
    borderBottomLeftRadius: radii.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: radii.sm,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  category: {
    color: colors.orangeBright,
    fontSize: 11,
    ...fonts.label,
    marginBottom: 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    lineHeight: 21,
  },
  saveButton: {
    padding: 2,
  },
  blurb: {
    color: colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  difficultyBadge: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  difficultyText: {
    fontSize: 11,
    ...fonts.label,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  tagsRow: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radii.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
  },
  tagText: {
    color: colors.textMuted,
    fontSize: 10.5,
    ...fonts.heading,
  },
  loreRow: {
    flexDirection: 'row',
  },
});
