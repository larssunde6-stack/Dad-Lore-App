import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/theme';
import { Rank } from '../utils/level';

// Animated.Text (RN's own, ref-forwarding version) rather than our custom
// Text wrapper — Animated.createAnimatedComponent needs a real ref to the
// native text node to drive the interpolated color, which a plain function
// component like our Text doesn't forward.
const baseStyle = { fontFamily: 'EBGaramond_400Regular' };

type Props = {
  rank: Rank;
  style?: StyleProp<TextStyle>;
};

export default function RankText({ rank, style }: Props) {
  const shimmer = useRef(new Animated.Value(0)).current;

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

  if (!rank.isTopRank) {
    return <Text style={style}>{rank.name}</Text>;
  }

  const color = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textPrimary, colors.purpleBright],
  });

  return <Animated.Text style={[baseStyle, style, { color }]}>{rank.name}</Animated.Text>;
}
