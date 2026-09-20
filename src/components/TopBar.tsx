import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { getLevel } from '../utils/level';

type Props = {
  xp: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export default function TopBar({
  xp,
  showSearch = true,
  searchPlaceholder,
  searchValue = '',
  onSearchChange,
}: Props) {
  const { level } = getLevel(xp);

  return (
    <View style={styles.row}>
      <View style={[styles.balanceChip, shadow.soft]}>
        <Text style={styles.balanceText}>Lvl. {level.toString().padStart(2, '0')}</Text>
      </View>

      {showSearch ? (
        <View style={[styles.searchBar, shadow.soft]}>
          <MaterialCommunityIcons name="magnify" size={17} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
          />
          {searchValue.length > 0 ? (
            <Pressable onPress={() => onSearchChange?.('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle-outline" size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={styles.spacer} />
      )}

      <Pressable style={[styles.iconButton, shadow.soft]}>
        <MaterialCommunityIcons name="bell-outline" size={18} color={colors.textPrimary} />
        <View style={styles.bellDot} />
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
  balanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginRight: spacing.sm,
  },
  balanceText: {
    color: colors.orangeBright,
    fontSize: 12.5,
    ...fonts.heading,
  },
  spacer: {
    flex: 1,
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
