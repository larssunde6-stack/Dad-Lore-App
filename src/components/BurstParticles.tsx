import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

// A small outward particle burst, reused for both the level-up popup's
// big celebratory blast and the bookmark button's small confirm blast —
// same interpolation technique, just parameterized by scale/color/count.
type Props = {
  color: string;
  count?: number;
  distance?: number;
  particleSize?: number;
  duration?: number;
};

export default function BurstParticles({
  color,
  count = 14,
  distance = 66,
  particleSize = 7,
  duration = 800,
}: Props) {
  const burst = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.15);
      const dist = distance * (0.7 + (i % 4) * 0.15);
      return {
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: particleSize * (0.7 + (i % 3) * 0.4),
      };
    })
  ).current;

  useEffect(() => {
    Animated.timing(burst, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [burst, duration]);

  return (
    <View style={styles.layer} pointerEvents="none">
      {particles.map((p, i) => {
        const translateX = burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.tx] });
        const translateY = burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.ty] });
        const opacity = burst.interpolate({ inputRange: [0, 0.55, 1], outputRange: [1, 0.9, 0] });
        const scale = burst.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 1, 0.6] });
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: color,
                opacity,
                transform: [{ translateX }, { translateY }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
