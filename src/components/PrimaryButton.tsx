import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, shadow } from '../theme/theme';

type Props = {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
};

export default function PrimaryButton({
  label,
  icon,
  onPress,
  variant = 'solid',
  style,
  disabled,
}: Props) {
  const isSolid = variant === 'solid';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isSolid ? styles.solid : styles.outline,
        isSolid && shadow.glow,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.notch} />
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={isSolid ? colors.textOnOrange : colors.orange}
          style={styles.icon}
        />
      ) : null}
      <Text style={[styles.label, isSolid ? styles.labelSolid : styles.labelOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  solid: {
    backgroundColor: colors.orange,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.orange,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.6,
  },
  notch: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    backgroundColor: colors.textOnOrange,
    opacity: 0.12,
    borderTopLeftRadius: 16,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    ...fonts.heading,
    letterSpacing: 0.3,
  },
  labelSolid: {
    color: colors.textOnOrange,
  },
  labelOutline: {
    color: colors.orange,
  },
});
