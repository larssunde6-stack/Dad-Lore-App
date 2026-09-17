import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme/theme';

type Props = {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
};

export default function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.orange,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    ...fonts.heading,
  },
  labelActive: {
    color: colors.textOnOrange,
  },
});
