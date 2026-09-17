import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CompletedLoreEntry } from '../data/completedLore';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

export default function CompletedLoreCard({ entry }: { entry: CompletedLoreEntry }) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = () => {
    if (showSummary || isSummarizing) return;
    setIsSummarizing(true);
    setTimeout(() => {
      setIsSummarizing(false);
      setShowSummary(true);
    }, 1100);
  };

  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons name={entry.icon as any} size={22} color={colors.orange} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {entry.activityTitle}
          </Text>
          <Text style={styles.date}>{entry.dateCompleted}</Text>
        </View>
        <View style={styles.loreBadge}>
          <MaterialCommunityIcons name="fire" size={13} color={colors.orange} />
          <Text style={styles.loreBadgeText}>+{entry.loreEarned}</Text>
        </View>
      </View>

      <Text style={styles.note}>{entry.note}</Text>

      {showSummary ? (
        <View style={styles.summaryBox}>
          <View style={styles.summaryLabelRow}>
            <MaterialCommunityIcons name="creation" size={13} color={colors.orangeBright} />
            <Text style={styles.summaryLabel}>AI Lore Summary</Text>
          </View>
          <Text style={styles.summaryText}>&ldquo;{entry.loreSummary}&rdquo;</Text>
        </View>
      ) : (
        <Pressable
          onPress={handleSummarize}
          style={styles.summarizeButton}
          disabled={isSummarizing}
        >
          {isSummarizing ? (
            <ActivityIndicator size="small" color={colors.orange} />
          ) : (
            <MaterialCommunityIcons name="creation" size={15} color={colors.orange} />
          )}
          <Text style={styles.summarizeText}>
            {isSummarizing ? 'Summarizing...' : 'Summarize My Lore'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.orange,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14.5,
    ...fonts.heading,
    lineHeight: 19,
  },
  date: {
    color: colors.textMuted,
    fontSize: 11.5,
    marginTop: 2,
  },
  loreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  loreBadgeText: {
    color: colors.orangeBright,
    fontSize: 11,
    marginLeft: 3,
    ...fonts.heading,
  },
  note: {
    color: colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  summarizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  summarizeText: {
    color: colors.orange,
    fontSize: 12.5,
    marginLeft: 6,
    ...fonts.heading,
  },
  summaryBox: {
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    padding: spacing.md,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.orangeBright,
    fontSize: 10.5,
    marginLeft: 4,
    ...fonts.label,
  },
  summaryText: {
    color: colors.textPrimary,
    fontSize: 13.5,
    lineHeight: 19,
    ...fonts.heading,
    fontStyle: 'italic',
  },
});
