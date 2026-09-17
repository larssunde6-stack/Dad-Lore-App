import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

type Props = {
  loreBalance: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
};

export default function TopBar({ loreBalance, showSearch = true, searchPlaceholder }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.balanceChip, shadow.soft]}>
        <View style={styles.balanceIcon}>
          <MaterialCommunityIcons name="fire" size={16} color={colors.orange} />
        </View>
        <Text style={styles.balanceText}>{loreBalance.toLocaleString()}</Text>
      </View>

      {showSearch ? (
        <Pressable style={[styles.searchBar, shadow.soft]}>
          <MaterialCommunityIcons name="magnify" size={17} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder} numberOfLines={1}>
            {searchPlaceholder}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}

      <Pressable style={[styles.bellButton, shadow.soft]}>
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
  balanceIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  balanceText: {
    color: colors.textPrimary,
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
    marginRight: spacing.sm,
  },
  searchPlaceholder: {
    color: colors.textMuted,
    fontSize: 12.5,
    marginLeft: 6,
    flexShrink: 1,
  },
  bellButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
