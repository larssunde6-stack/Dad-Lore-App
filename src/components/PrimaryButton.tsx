import React, { useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fonts, pressSpring } from '../theme/theme';
import { useAccent } from '../context/AccentContext';

type Props = {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({
  label,
  icon,
  onPress,
  variant = 'solid',
  style,
  disabled,
  loading,
}: Props) {
  const isSolid = variant === 'solid';
  const scale = useRef(new Animated.Value(1)).current;
  const { palette } = useAccent();

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      ...pressSpring,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const glow = {
    shadowColor: palette.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        disabled={disabled || loading}
        style={[
          styles.base,
          !isSolid && styles.outline,
          !isSolid && { borderColor: palette.base },
          isSolid && glow,
          (disabled || loading) && styles.disabled,
        ]}
      >
        {isSolid ? (
          <LinearGradient
            colors={palette.gradientFab}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View style={[styles.notch, isSolid && { backgroundColor: palette.onAccent }]} />
        {loading ? (
          <ActivityIndicator size="small" color={isSolid ? palette.onAccent : palette.base} />
        ) : (
          <>
            {icon ? (
              <MaterialCommunityIcons
                name={icon}
                size={18}
                color={isSolid ? palette.onAccent : palette.base}
                style={styles.icon}
              />
            ) : null}
            <Text style={[styles.label, { color: isSolid ? palette.onAccent : palette.base }]}>
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.6,
  },
  notch: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    opacity: 0.12,
    borderTopLeftRadius: 16,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    ...fonts.heading,
    letterSpacing: 0.3,
  },
});
