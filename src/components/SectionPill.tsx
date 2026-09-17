import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme/theme';

export default function SectionPill({ label, count }: { label: string; count?: number }) {
  return (
    <View style={styles.row}>
      <View style={styles.pill}>
        <Text style={styles.label}>{label}</Text>
      </View>
      {typeof count === 'number' ? <Text style={styles.count}>{count} total</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  pill: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    ...fonts.heading,
  },
  count: {
    color: colors.textMuted,
    fontSize: 11.5,
  },
});
