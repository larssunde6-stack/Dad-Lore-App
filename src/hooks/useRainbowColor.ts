import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { hslToHex } from '../theme/colorMath';

const STOPS = 12;
const CYCLE_MS = 4000;
const INPUT_RANGE = Array.from({ length: STOPS + 1 }, (_, i) => i / STOPS);

// A handful of hue-stepped stops rather than a live numeric hue —
// Animated's color interpolation only works between fixed color
// strings, so this samples the wheel finely enough to read as a smooth
// continuous cycle. The first and last stop are identical (0deg wraps
// back to 0deg) so the loop has no visible seam. `alpha` lets a caller
// get a translucent/tinted variant (e.g. a badge background) that
// cycles in lockstep with an opaque one (e.g. its border/text) without
// needing to string-concat an alpha suffix onto an already-animated color.
export function useRainbowColor(alpha?: number) {
  const progress = useRef(new Animated.Value(0)).current;
  const stops = useRef(
    alpha === undefined
      ? Array.from({ length: STOPS + 1 }, (_, i) => hslToHex((360 / STOPS) * i, 85, 60))
      : Array.from({ length: STOPS + 1 }, (_, i) => {
          const hex = hslToHex((360 / STOPS) * i, 85, 60);
          const bigint = parseInt(hex.slice(1), 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        })
  ).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: CYCLE_MS,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  return progress.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: stops,
  });
}
