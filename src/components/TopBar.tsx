import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from './Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RankText from './RankText';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { getLevel, getRank } from '../utils/level';
import { useRainbowColor } from '../hooks/useRainbowColor';
import { useAccent } from '../context/AccentContext';

type Props = {
  xp: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onNotificationsPress?: () => void;
};

export default function TopBar({
  xp,
  showSearch = true,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
  onNotificationsPress,
}: Props) {
  const { level } = getLevel(xp);
  const rank = getRank(level);
  const rainbowBorder = useRainbowColor();
  const rainbowBg = useRainbowColor(0.1);
  const { mode, palette } = useAccent();
  const accentSynced = mode.type === 'rainbow';
  const [searchOpen, setSearchOpen] = useState(false);

  if (searchOpen) {
    return (
      <View style={styles.row}>
        <View style={[styles.searchBar, shadow.soft]}>
          <MaterialCommunityIcons name="magnify" size={17} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoFocus
          />
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSearchOpen(false);
            onSearchChange?.('');
          }}
          style={({ pressed }) => [styles.iconButton, shadow.soft, pressed && styles.iconButtonPressed]}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="close" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Animated.View
        style={[
          styles.balanceChip,
          shadow.soft,
          rank.isRainbow
            ? accentSynced
              ? { borderColor: palette.base, backgroundColor: palette.muted }
              : { borderColor: rainbowBorder, backgroundColor: rainbowBg }
            : { borderColor: rank.color, backgroundColor: `${rank.color}1A` },
        ]}
      >
        <RankText rank={rank} style={styles.balanceText} numberOfLines={1} />
      </Animated.View>

      <View style={styles.wordmarkWrap} pointerEvents="none">
        <Image source={require('../../assets/logo-wordmark.png')} style={styles.wordmark} resizeMode="contain" />
      </View>

      {showSearch ? (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSearchOpen(true);
          }}
          style={({ pressed }) => [styles.iconButton, shadow.soft, pressed && styles.iconButtonPressed]}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textPrimary} />
        </Pressable>
      ) : null}

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onNotificationsPress?.();
        }}
        style={({ pressed }) => [styles.iconButton, shadow.soft, pressed && styles.iconButtonPressed]}
        hitSlop={8}
      >
        <MaterialCommunityIcons name="bell-outline" size={18} color={colors.textPrimary} />
        <View style={[styles.bellDot, { backgroundColor: palette.base }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  wordmarkWrap: {
    flex: 1,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  wordmark: {
    width: 42,
    height: 22,
  },
  balanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 110,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  balanceText: {
    fontSize: 11,
    ...fonts.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12.5,
    marginLeft: 6,
    paddingVertical: 0,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  iconButtonPressed: {
    opacity: 0.6,
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },
});
