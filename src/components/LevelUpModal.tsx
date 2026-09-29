import React, { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RankText from './RankText';
import { useCompletions } from '../context/CompletionsContext';
import { getRank } from '../utils/level';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';

const PARTICLE_COUNT = 14;

function BurstParticles() {
  const burst = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.15);
      const distance = 66 + (i % 4) * 22;
      return {
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 7 + (i % 3) * 5,
      };
    })
  ).current;

  useEffect(() => {
    Animated.timing(burst, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [burst]);

  return (
    <View style={styles.burstLayer} pointerEvents="none">
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

export default function LevelUpModal() {
  const { levelUpEvent, dismissLevelUp } = useCompletions();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!levelUpEvent) return;

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

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismissLevelUp}>
      <Pressable style={styles.overlay} onPress={dismissLevelUp}>
        <Animated.View style={[styles.card, shadow.glow, { opacity, transform: [{ scale }] }]}>
          <View style={styles.badgeWrap}>
            <BurstParticles />
            <LinearGradient
              colors={gradients.fab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <MaterialCommunityIcons name="trophy-award" size={32} color={colors.textOnOrange} />
            </LinearGradient>
          </View>

          <Text style={styles.eyebrow}>LEVEL UP</Text>
          <Text style={styles.levelNumber}>Level {levelUpEvent.level}</Text>
          <RankText rank={rank} style={styles.rankName} />

          {levelUpEvent.rankChanged ? (
            <Text style={styles.rankChangedNote}>New rank unlocked</Text>
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
  },
  badgeWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  burstLayer: {
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
    backgroundColor: colors.orange,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.orangeBright,
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
    marginBottom: spacing.lg,
  },
  tapHint: {
    color: colors.textMuted,
    fontSize: 10.5,
    ...fonts.label,
    marginTop: spacing.md,
  },
});
