import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { useAccent } from '../context/AccentContext';

type Props = {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  gradient?: boolean;
};

export default function SegmentedControl({ options, value, onChange, gradient = true }: Props) {
  const { palette } = useAccent();

  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option === value;

        if (active && gradient) {
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [styles.segmentGradientWrap, pressed && styles.pressed]}
            >
              <LinearGradient
                colors={palette.gradientFab}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.segmentGradient}
              >
                <Text style={[styles.label, { color: palette.onAccent }]}>{option}</Text>
              </LinearGradient>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={({ pressed }) => [
              styles.segment,
              active && { backgroundColor: palette.base },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, active && { color: palette.onAccent }]}>{option}</Text>
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
  pressed: {
    opacity: 0.7,
  },
});
