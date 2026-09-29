import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, pressSpring, radii } from '../theme/theme';
import { useAccent } from '../context/AccentContext';

type Props = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  active?: boolean;
  onPress?: () => void;
};

export default function CategoryChip({ label, icon, active, onPress }: Props) {
  const { palette } = useAccent();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, ...pressSpring, useNativeDriver: true }).start();
  };

  const content = (
    <>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color={active ? palette.onAccent : palette.bright}
      />
      <Text style={[styles.label, { color: active ? palette.onAccent : colors.textSecondary }]}>
        {label}
      </Text>
    </>
  );

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.94)}
        onPressOut={() => animateTo(1)}
        style={[
          styles.chip,
          active ? { borderColor: 'transparent', shadowColor: palette.glow } : styles.chipInactive,
          active && styles.chipGlow,
        ]}
      >
        {active ? (
          <LinearGradient
            colors={palette.gradientFab}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    marginRight: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipGlow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  label: {
    fontSize: 13,
    marginLeft: 6,
    ...fonts.heading,
  },
});
