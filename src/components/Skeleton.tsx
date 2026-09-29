import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme/theme';

function usePulse() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return pulse;
}

type BlockProps = { style?: StyleProp<ViewStyle> };

export function SkeletonBlock({ style }: BlockProps) {
  const pulse = usePulse();
  return <Animated.View style={[styles.block, style, { opacity: pulse }]} />;
}

// Mirrors ProfileScreen's three stat cards while loading.
export function StatCardSkeletonRow() {
  return (
    <View style={styles.statsRow}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.statCard}>
          <SkeletonBlock style={styles.statIcon} />
          <SkeletonBlock style={styles.statValueLine} />
          <SkeletonBlock style={styles.statLabelLine} />
        </View>
      ))}
    </View>
  );
}

// Mirrors ActivityCarouselCard's shape, used by Explore's feed while loading.
export function ActivityCarouselSkeleton() {
  return (
    <View style={[styles.card, styles.carouselCard]}>
      <View style={styles.topRow}>
        <SkeletonBlock style={styles.thumbnail} />
        <SkeletonBlock style={styles.kindTag} />
      </View>
      <SkeletonBlock style={styles.titleLine} />
      <SkeletonBlock style={styles.blurbLine} />
      <SkeletonBlock style={[styles.blurbLine, styles.blurbLineShort]} />
      <View style={styles.statsRow}>
        <SkeletonBlock style={styles.statBlock} />
        <SkeletonBlock style={styles.statBlock} />
        <SkeletonBlock style={styles.statBlock} />
      </View>
    </View>
  );
}

// Mirrors ActivityCard's shape, used by Your Lore's lists while loading.
export function ActivityCardSkeleton() {
  return (
    <View style={[styles.card, styles.listCard]}>
      <View style={styles.topRow}>
        <SkeletonBlock style={styles.iconBadge} />
        <View style={styles.headerText}>
          <SkeletonBlock style={styles.kindLine} />
          <SkeletonBlock style={styles.titleLineSmall} />
        </View>
      </View>
      <SkeletonBlock style={styles.blurbLine} />
      <SkeletonBlock style={[styles.blurbLine, styles.blurbLineShort]} />
    </View>
  );
}

type ListProps = { count?: number };

export function ActivityCarouselSkeletonList({ count = 4 }: ListProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCarouselSkeleton key={i} />
      ))}
    </View>
  );
}

export function ActivityCardSkeletonList({ count = 4 }: ListProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  carouselCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  listCard: {
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: radii.sm,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  kindTag: {
    marginLeft: spacing.md,
    flex: 1,
    height: 20,
    borderRadius: radii.pill,
  },
  kindLine: {
    width: '40%',
    height: 10,
    marginBottom: spacing.sm,
  },
  titleLine: {
    width: '80%',
    height: 18,
    marginBottom: spacing.md,
  },
  titleLineSmall: {
    width: '70%',
    height: 15,
  },
  blurbLine: {
    width: '100%',
    height: 12,
    marginBottom: spacing.sm,
  },
  blurbLineShort: {
    width: '55%',
    marginBottom: 0,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  statBlock: {
    flex: 1,
    height: 28,
    marginRight: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    marginRight: spacing.md,
  },
  statIcon: {
    width: 20,
    height: 20,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  statValueLine: {
    width: 32,
    height: 16,
    marginBottom: 4,
  },
  statLabelLine: {
    width: 56,
    height: 9,
  },
});
