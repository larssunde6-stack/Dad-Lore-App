import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

type Props = {
  title: string;
  onFilterPress?: () => void;
};

const FILTER_BUTTON_SIZE = 42;

export default function PillHeader({ title, onFilterPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.sideSpacer} />
      <View style={styles.pillWrap}>
        <View style={[styles.pill, shadow.soft]}>
          <Text style={styles.pillText}>{title}</Text>
        </View>
      </View>
      <Pressable onPress={onFilterPress} style={[styles.filterButton, shadow.soft]}>
        <MaterialCommunityIcons name="tune" size={19} color={colors.orange} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  sideSpacer: {
    width: FILTER_BUTTON_SIZE,
  },
  pillWrap: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: colors.orangeMuted,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  pillText: {
    color: colors.orangeBright,
    fontSize: 18,
    ...fonts.display,
    letterSpacing: 1,
  },
  filterButton: {
    width: FILTER_BUTTON_SIZE,
    height: FILTER_BUTTON_SIZE,
    borderRadius: FILTER_BUTTON_SIZE / 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
