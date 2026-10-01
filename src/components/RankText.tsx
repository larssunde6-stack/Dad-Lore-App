import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/theme';
import { Rank } from '../utils/level';
import { useRainbowColor } from '../hooks/useRainbowColor';
import { useAccent } from '../context/AccentContext';

// Animated.Text (RN's own, ref-forwarding version) rather than our custom
// Text wrapper — Animated.createAnimatedComponent needs a real ref to the
// native text node to drive the interpolated color, which a plain function
// component like our Text doesn't forward.
const baseStyle = { fontFamily: 'EBGaramond_400Regular' };

type Props = {
  rank: Rank;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export default function RankText({ rank, style, numberOfLines }: Props) {
  const shimmer = useRef(new Animated.Value(0)).current;
  const rainbow = useRainbowColor();
  const { mode, palette } = useAccent();

  useEffect(() => {
    if (!rank.isTopRank) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [rank.isTopRank, shimmer]);

  if (rank.isRainbow) {
    // When the app's accent itself is in rainbow mode, read the exact
    // same color the rest of the app is painting with that frame
    // instead of running an independent cycle — otherwise this label
    // and every gradiented/accent element elsewhere visibly drift out
    // of phase with each other.
    const color = mode.type === 'rainbow' ? palette.base : rainbow;
    return (
      <Animated.Text
        style={[baseStyle, style, { color }]}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
      >
        {rank.name}
      </Animated.Text>
    );
  }

  if (!rank.isTopRank) {
    return (
      <Text style={[style, { color: rank.color }]} numberOfLines={numberOfLines} ellipsizeMode="tail">
        {rank.name}
      </Text>
    );
  }

  const color = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.purpleBright],
  });

  return (
    <Animated.Text
      style={[baseStyle, style, { color }]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {rank.name}
    </Animated.Text>
  );
}
