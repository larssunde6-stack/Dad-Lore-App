import React, { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RankText from './RankText';
import BurstParticles from './BurstParticles';
import { useCompletions } from '../context/CompletionsContext';
import { useAccent } from '../context/AccentContext';
import { getRank } from '../utils/level';
import { colors, fonts, radii, spacing } from '../theme/theme';

export default function LevelUpModal() {
  const { levelUpEvent, dismissLevelUp } = useCompletions();
  const { palette, setAccent } = useAccent();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [colorApplied, setColorApplied] = useState(false);

  useEffect(() => {
    if (!levelUpEvent) return;

    setColorApplied(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.setValue(0.8);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 140, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [levelUpEvent, scale, opacity]);

  if (!levelUpEvent) return null;

  const rank = getRank(levelUpEvent.level);

  const handleApplyColor = () => {
    setAccent(rank);
    setColorApplied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismissLevelUp}>
      <Pressable style={styles.overlay} onPress={dismissLevelUp}>
        <Animated.View style={[styles.card, { shadowColor: palette.glow }, { opacity, transform: [{ scale }] }]}>
          <View style={styles.badgeWrap}>
            <BurstParticles color={palette.base} />
            <LinearGradient
              colors={palette.gradientFab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <MaterialCommunityIcons name="trophy-award" size={32} color={palette.onAccent} />
            </LinearGradient>
          </View>

          <Text style={[styles.eyebrow, { color: palette.bright }]}>LEVEL UP</Text>
          <Text style={styles.levelNumber}>Level {levelUpEvent.level}</Text>
          <RankText rank={rank} style={styles.rankName} />

          {levelUpEvent.rankChanged ? (
            <>
              <Text style={styles.rankChangedNote}>New rank unlocked</Text>
              <Pressable
                onPress={handleApplyColor}
                disabled={colorApplied}
                style={({ pressed }) => [
                  styles.colorButton,
                  { borderColor: rank.isRainbow ? palette.base : rank.color },
                  pressed && styles.colorButtonPressed,
                ]}
              >
                <MaterialCommunityIcons
                  name={colorApplied ? 'check' : 'palette-outline'}
                  size={14}
                  color={rank.isRainbow ? palette.base : rank.color}
                />
                <Text style={[styles.colorButtonText, { color: rank.isRainbow ? palette.base : rank.color }]}>
                  {colorApplied ? 'Color applied' : 'Make this your color?'}
                </Text>
              </Pressable>
            </>
          ) : null}

          <Text style={styles.tapHint}>TAP ANYWHERE TO CONTINUE</Text>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 12,
    ...fonts.label,
    marginBottom: spacing.xs,
  },
  levelNumber: {
    color: colors.textPrimary,
    fontSize: 28,
    ...fonts.display,
    marginBottom: spacing.xs,
  },
  rankName: {
    fontSize: 18,
    ...fonts.heading,
    marginBottom: spacing.sm,
  },
  rankChangedNote: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  colorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  colorButtonPressed: {
    opacity: 0.65,
  },
  colorButtonText: {
    fontSize: 12.5,
    ...fonts.heading,
    marginLeft: 6,
  },
  tapHint: {
    color: colors.textMuted,
    fontSize: 10.5,
    ...fonts.label,
    marginTop: spacing.md,
  },
});
