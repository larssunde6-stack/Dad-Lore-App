import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

type Props = {
  title: string;
  onFilterPress?: () => void;
  countLabel?: string;
  compact?: boolean;
};

const FILTER_BUTTON_SIZE = 42;

export default function PillHeader({ title, onFilterPress, countLabel, compact }: Props) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={styles.sideSpacer}>
        {countLabel ? (
          <View style={[styles.countPill, !compact && [styles.countPillFilled, shadow.soft]]}>
            <Text style={styles.countLabel}>{countLabel}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.pillWrap}>
        <View style={[styles.pill, !compact && [styles.pillFilled, shadow.soft]]}>
          <Text style={styles.pillText}>{title}</Text>
        </View>
      </View>
      <Pressable
        onPress={onFilterPress}
        style={[styles.filterButton, !compact && [styles.filterButtonFilled, shadow.soft]]}
      >
        <MaterialCommunityIcons name="tune" size={19} color={colors.orange} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  rowCompact: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sideSpacer: {
    minWidth: FILTER_BUTTON_SIZE,
  },
  countPill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  countPillFilled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countLabel: {
    color: colors.textMuted,
    fontSize: 11,
    ...fonts.heading,
  },
  pillWrap: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  pillFilled: {
    backgroundColor: colors.orangeMuted,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
  },
  pillText: {
    color: colors.orangeBright,
    fontSize: 18,
    ...fonts.display,
    letterSpacing: 1,
  },
  filterButton: {
    width: FILTER_BUTTON_SIZE,
    height: FILTER_BUTTON_SIZE,
    borderRadius: FILTER_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonFilled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
