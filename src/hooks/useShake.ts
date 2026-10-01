import { useRef } from 'react';
import { Animated } from 'react-native';

// A real shake, not a wobble — wider swing (±22deg) with an extra
// oscillation versus a basic 2-step wiggle. Shared by the bookmark
// button and the Create Lore FAB so both get the identical motion.
export function useShake(amplitudeDeg = 22) {
  const shake = useRef(new Animated.Value(0)).current;

  const trigger = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -0.6, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const rotate = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${amplitudeDeg}deg`, `${amplitudeDeg}deg`],
  });

  return { rotate, trigger };
}
