import React from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAccent } from '../context/AccentContext';
import { useRainbowColor } from '../hooks/useRainbowColor';
import { RANKS } from '../utils/level';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  currentLevel: number;
};

function RainbowSwatch({ size }: { size: number }) {
  const color = useRainbowColor();
  return (
    <Animated.View
      style={[styles.swatch, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}
    />
  );
}

export default function AccentPickerModal({ visible, onClose, currentLevel }: Props) {
  const { mode, setAccent, resetAccent } = useAccent();
  const unlockedRanks = RANKS.filter((r) => r.minLevel <= currentLevel);

  const handlePick = (rank: (typeof RANKS)[number]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAccent(rank);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetAccent();
  };

  const isRankActive = (rank: (typeof RANKS)[number]) =>
    rank.isRainbow ? mode.type === 'rainbow' : mode.type === 'static' && mode.hex === rank.color;

  const isDefaultActive = mode.type === 'static' && mode.hex === colors.orange;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, shadow.card]}>
          <View style={styles.headerRow}>
            <MaterialCommunityIcons name="palette-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.title}>App Color</Text>
            <Pressable onPress={onClose} hitSlop={8} style={({ pressed }) => [styles.closeButton, pressed && styles.pressedFaint]}>
              <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>Pick from any rank you've unlocked.</Text>

          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.row, pressed && styles.pressedFaint]}
          >
            <View style={[styles.swatch, { backgroundColor: colors.orange }]} />
            <Text style={styles.rowLabel}>Default Orange</Text>
            {isDefaultActive ? (
              <MaterialCommunityIcons name="check" size={18} color={colors.orange} />
            ) : null}
          </Pressable>

          {unlockedRanks.map((rank) => (
            <Pressable
              key={rank.name}
              onPress={() => handlePick(rank)}
              style={({ pressed }) => [styles.row, pressed && styles.pressedFaint]}
            >
              {rank.isRainbow ? (
                <RainbowSwatch size={20} />
              ) : (
                <View style={[styles.swatch, { backgroundColor: rank.color }]} />
              )}
              <Text style={styles.rowLabel}>{rank.name}</Text>
              {isRankActive(rank) ? (
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color={rank.isRainbow ? colors.textPrimary : rank.color}
                />
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '75%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    marginLeft: spacing.sm,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  pressedFaint: {
    opacity: 0.65,
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.md,
  },
  rowLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    ...fonts.heading,
  },
});
