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

    // One continuous sweep (0->1, looped) rather than a back-and-forth
    // ping-pong — same shape as useRainbowColor's own loop, just with a
    // 2-color white/purple stop set instead of a full hue sweep, so this
    // reads as the same smooth "rainbow-style" animation restricted to
    // the top rank's own palette.
    shimmer.setValue(0);
    const loop = Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 4000, useNativeDriver: false })
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
    inputRange: [0, 0.5, 1],
    outputRange: [colors.textPrimary, colors.purpleBright, colors.textPrimary],
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
