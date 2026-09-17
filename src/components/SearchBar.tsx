import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <Pressable style={[styles.container, shadow.soft]}>
      <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
      <Text style={styles.placeholder}>{placeholder}</Text>
      <View style={styles.locationPill}>
        <MaterialCommunityIcons name="map-marker" size={14} color={colors.orange} />
        <Text style={styles.locationText}>Near Me</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  placeholder: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontSize: 15,
    ...fonts.body,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  locationText: {
    color: colors.orangeBright,
    fontSize: 12,
    marginLeft: 4,
    ...fonts.label,
    letterSpacing: 0.3,
    textTransform: 'none',
  },
});
