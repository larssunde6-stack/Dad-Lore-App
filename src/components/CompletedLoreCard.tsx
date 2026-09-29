import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CompletedLoreEntry } from '../data/completedLore';
import { supabase } from '../lib/supabase';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { useAccent } from '../context/AccentContext';

export default function CompletedLoreCard({ entry }: { entry: CompletedLoreEntry }) {
  const { palette } = useAccent();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (summaryText || isSummarizing) return;
    setIsSummarizing(true);

    try {
      const { data, error } = await supabase.functions.invoke<{ summary?: string; error?: string }>(
        'summarize-lore',
        { body: { note: entry.note } }
      );
      if (error || !data?.summary) {
        throw error ?? new Error(data?.error ?? 'No summary returned');
      }
      setSummaryText(data.summary);
    } catch {
      // The Edge Function isn't deployed yet, or the call failed (no
      // network, etc.) - fall back to the pre-written summary so the
      // interaction still completes rather than dead-ending.
      setSummaryText(entry.loreSummary);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <View style={[styles.card, shadow.card, { borderLeftColor: palette.base }]}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, { backgroundColor: palette.muted }]}>
          <MaterialCommunityIcons name={entry.icon as any} size={22} color={palette.base} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {entry.activityTitle}
          </Text>
          <Text style={styles.date}>{entry.dateCompleted}</Text>
        </View>
        <View style={[styles.loreBadge, { backgroundColor: palette.muted }]}>
          <MaterialCommunityIcons name="fire" size={13} color={palette.base} />
          <Text style={[styles.loreBadgeText, { color: palette.bright }]}>+{entry.loreEarned}</Text>
        </View>
      </View>

      <Text style={styles.note}>{entry.note}</Text>

      {summaryText ? (
        <View style={[styles.summaryBox, { backgroundColor: palette.muted, borderColor: palette.deep }]}>
          <View style={styles.summaryLabelRow}>
            <MaterialCommunityIcons name="creation" size={13} color={palette.bright} />
            <Text style={[styles.summaryLabel, { color: palette.bright }]}>AI Lore Summary</Text>
          </View>
          <Text style={styles.summaryText}>&ldquo;{summaryText}&rdquo;</Text>
        </View>
      ) : (
        <Pressable
          onPress={handleSummarize}
          style={styles.summarizeButton}
          disabled={isSummarizing}
        >
          {isSummarizing ? (
            <ActivityIndicator size="small" color={palette.base} />
          ) : (
            <MaterialCommunityIcons name="creation" size={15} color={palette.base} />
          )}
          <Text style={[styles.summarizeText, { color: palette.base }]}>
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
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  loreBadgeText: {
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
    fontSize: 12.5,
    marginLeft: 6,
    ...fonts.heading,
  },
  summaryBox: {
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing.md,
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
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
