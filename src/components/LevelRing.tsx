import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/theme';
import { useRainbowColor } from '../hooks/useRainbowColor';
import { useAccent } from '../context/AccentContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  strokeWidth?: number;
  progressPct: number;
  color?: string;
  rainbow?: boolean;
  children?: React.ReactNode;
};

export default function LevelRing({
  size,
  strokeWidth = 6,
  progressPct,
  color = colors.orange,
  rainbow,
  children,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(0)).current;
  const rainbowStroke = useRainbowColor();
  const { mode, palette } = useAccent();
  const accentSynced = mode.type === 'rainbow';

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progressPct,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPct, progress]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceRaised}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={rainbow ? (accentSynced ? palette.base : rainbowStroke) : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
