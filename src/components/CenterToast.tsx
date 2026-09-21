import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

export type ToastState = {
  message: string;
  tone: 'success' | 'error';
} | null;

type Props = {
  toast: ToastState;
};

export default function CenterToast({ toast }: Props) {
  const [rendered, setRendered] = useState(toast);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      setRendered(toast);
      Animated.spring(anim, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }).start();
    } else if (rendered) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setRendered(null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  if (!rendered) return null;

  const isError = rendered.tone === 'error';

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.toast,
          shadow.card,
          { borderColor: isError ? '#E6807A' : colors.success },
          {
            opacity: anim,
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={isError ? 'alert-circle' : 'check-circle'}
          size={22}
          color={isError ? '#E6807A' : colors.success}
        />
        <Text style={styles.text}>{rendered.message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    paddingHorizontal: spacing.xl,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.md,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    maxWidth: 320,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 14,
    marginLeft: spacing.sm,
    ...fonts.heading,
    flexShrink: 1,
  },
});
