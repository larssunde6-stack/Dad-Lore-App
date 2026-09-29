import React, { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';
import RankText from './RankText';
import { useCompletions } from '../context/CompletionsContext';
import { getRank } from '../utils/level';
import { colors, fonts, gradients, radii, shadow, spacing } from '../theme/theme';

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
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, shadow.glow, { opacity, transform: [{ scale }] }]}>
          <LinearGradient
            colors={gradients.fab}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <MaterialCommunityIcons name="trophy-award" size={32} color={colors.textOnOrange} />
          </LinearGradient>

          <Text style={styles.eyebrow}>LEVEL UP</Text>
          <Text style={styles.levelNumber}>Level {levelUpEvent.level}</Text>
          <RankText rank={rank} style={styles.rankName} />

          {levelUpEvent.rankChanged ? (
            <Text style={styles.rankChangedNote}>New rank unlocked</Text>
          ) : null}

          <PrimaryButton label="Keep Going" onPress={dismissLevelUp} style={styles.button} />
        </Animated.View>
      </View>
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
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
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
  button: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
});
