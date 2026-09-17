import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

type Props = {
  title: string;
  onFilterPress?: () => void;
};

export default function PillHeader({ title, onFilterPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.pill, shadow.soft]}>
        <Text style={styles.pillText}>{title}</Text>
      </View>
      <Pressable onPress={onFilterPress} style={[styles.filterButton, shadow.soft]}>
        <MaterialCommunityIcons name="tune" size={18} color={colors.orange} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  pill: {
    backgroundColor: colors.orangeMuted,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    borderRadius: radii.pill,
    paddingVertical: 9,
    paddingHorizontal: 22,
  },
  pillText: {
    color: colors.orangeBright,
    fontSize: 15,
    ...fonts.display,
    letterSpacing: 1,
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
