import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  if (!toast) return null;

  const isError = toast.tone === 'error';

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View
        style={[
          styles.toast,
          shadow.card,
          { borderColor: isError ? '#E6807A' : colors.success },
        ]}
      >
        <MaterialCommunityIcons
          name={isError ? 'alert-circle' : 'check-circle'}
          size={22}
          color={isError ? '#E6807A' : colors.success}
        />
        <Text style={styles.text}>{toast.message}</Text>
      </View>
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
