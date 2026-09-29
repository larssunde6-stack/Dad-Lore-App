import React, { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BurstParticles from './BurstParticles';
import { colors, radii } from '../theme/theme';
import { useAccent } from '../context/AccentContext';

type Props = {
  saved?: boolean;
  pending?: boolean;
  onToggle?: () => void;
  size?: number;
  boxSize?: number;
  style?: StyleProp<ViewStyle>;
};

// Shared by ActivityCarouselCard, ActivityCard, and ActivityDetailScreen's
// hero button — same saved/pending/onToggle contract everywhere. Replaces
// the old ActivityIndicator-while-pending look: a tap immediately shows
// the icon as filled/accent-colored (optimistic — settles into its real
// saved state once the request resolves), with a quick shake and a small
// particle blast for feedback instead of a spinner.
export default function BookmarkButton({
  saved,
  pending,
  onToggle,
  size = 17,
  boxSize = 34,
  style,
}: Props) {
  const { palette } = useAccent();
  const shake = useRef(new Animated.Value(0)).current;
  const [burstToken, setBurstToken] = useState(0);
  const [burstVisible, setBurstVisible] = useState(false);

  const handlePress = () => {
    if (pending) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle?.();

    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0.6, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();

    setBurstToken((t) => t + 1);
    setBurstVisible(true);
    setTimeout(() => setBurstVisible(false), 500);
  };

  const rotate = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-14deg', '14deg'],
  });

  const isActive = pending || saved;

  return (
    <Pressable
      onPress={handlePress}
      disabled={pending}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconBox,
        { width: boxSize, height: boxSize },
        style,
        pressed && styles.pressed,
      ]}
    >
      {burstVisible ? <BurstParticles key={burstToken} color={palette.base} count={8} distance={22} particleSize={4} duration={450} /> : null}
      <Animated.View style={{ transform: [{ rotate }] }}>
        <MaterialCommunityIcons
          name={isActive ? 'bookmark' : 'bookmark-outline'}
          size={size}
          color={isActive ? palette.base : colors.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
