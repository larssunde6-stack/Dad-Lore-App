import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, spacing } from '../theme/theme';

export default function AccessibilityStatement() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="human-male-board" size={16} color={colors.textMuted} />
        <Text style={styles.heading}>Accessibility Statement</Text>
      </View>
      <Text style={styles.body}>
        Dad Lore is built with React Native so it works with your device's
        built-in screen reader (VoiceOver / TalkBack). The dark orange-and-black
        theme is designed with contrast in mind, and tap targets are sized for
        touch, not just for looks.
      </Text>
      <Text style={styles.body}>
        This is still an early build — a full screen-reader and keyboard
        navigation audit hasn't been done yet, so some labels or focus order
        may not be perfect everywhere. If something is hard to use with
        assistive technology, that's on us to fix, not on you to work around.
      </Text>
      <Text style={styles.contact}>
        Run into an accessibility issue? Let us know via Help & Support above.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.backgroundAlt,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heading: {
    color: colors.textSecondary,
    fontSize: 12,
    ...fonts.heading,
    marginLeft: spacing.xs,
  },
  body: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 17,
    marginBottom: spacing.sm,
  },
  contact: {
    color: colors.textMuted,
    fontSize: 11.5,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
