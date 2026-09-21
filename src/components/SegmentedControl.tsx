import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients, radii, spacing } from '../theme/theme';

type Props = {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  gradient?: boolean;
};

export default function SegmentedControl({ options, value, onChange, gradient }: Props) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option === value;

        if (active && gradient) {
          return (
            <Pressable key={option} onPress={() => onChange(option)} style={styles.segmentGradientWrap}>
              <LinearGradient
                colors={gradients.fab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.segmentGradient}
              >
                <Text style={[styles.label, styles.labelActive]}>{option}</Text>
              </LinearGradient>
            </Pressable>
          );
        }

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
  segmentGradientWrap: {
    flex: 1,
  },
  segmentGradient: {
    width: '100%',
    paddingVertical: 9,
    borderRadius: radii.pill,
    alignItems: 'center',
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
