import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow } from '../theme/theme';

type Props = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  active?: boolean;
  onPress?: () => void;
};

export default function CategoryChip({ label, icon, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive, active && shadow.glow]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color={active ? colors.textOnOrange : colors.orangeBright}
      />
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    marginRight: 10,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    marginLeft: 6,
    ...fonts.heading,
  },
  labelActive: {
    color: colors.textOnOrange,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
});
