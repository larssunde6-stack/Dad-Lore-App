import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';

type Props = {
  title: string;
  onFilterPress?: () => void;
  countLabel?: string;
  compact?: boolean;
  showFilter?: boolean;
  gradient?: boolean;
};

const FILTER_BUTTON_SIZE = 42;

export default function PillHeader({
  title,
  onFilterPress,
  countLabel,
  compact,
  showFilter = true,
  gradient = false,
}: Props) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {countLabel ? (
        <View style={[styles.countPill, shadow.soft]}>
          <Text style={styles.countLabel}>{countLabel}</Text>
        </View>
      ) : null}
      {gradient ? (
        <LinearGradient
          colors={gradients.fab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.pill, shadow.soft]}
        >
          <Text style={styles.pillText}>{title}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.pill, styles.pillFlat, shadow.soft]}>
          <Text style={styles.pillText}>{title}</Text>
        </View>
      )}
      {showFilter ? (
        <Pressable onPress={onFilterPress} style={[styles.filterButton, shadow.soft]}>
          <MaterialCommunityIcons name="tune" size={19} color={colors.orange} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  rowCompact: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  countPill: {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  countLabel: {
    color: colors.textMuted,
    fontSize: 11,
    ...fonts.heading,
  },
  pill: {
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  pillFlat: {
    backgroundColor: colors.orange,
  },
  pillText: {
    color: colors.textOnOrange,
    fontSize: 18,
    ...fonts.display,
    letterSpacing: 1,
  },
  filterButton: {
    position: 'absolute',
    right: 0,
    width: FILTER_BUTTON_SIZE,
    height: FILTER_BUTTON_SIZE,
    borderRadius: FILTER_BUTTON_SIZE / 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
