import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';

const REASONS = ['Inappropriate', 'Dangerous or Unsafe', 'Spam', 'Other'];

type Props = {
  visible: boolean;
  onClose: () => void;
  activityTitle: string;
};

export default function ReportModal({ visible, onClose, activityTitle }: Props) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedReason(null);
      setSubmitted(false);
    }, 250);
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    setSubmitted(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, shadow.card]}>
          {submitted ? (
            <View style={styles.confirmWrap}>
              <MaterialCommunityIcons name="check-circle-outline" size={36} color={colors.success} />
              <Text style={styles.confirmTitle}>Report sent</Text>
              <Text style={styles.confirmBody}>
                Thanks for flagging this — our team will take a look.
              </Text>
              <Pressable onPress={handleClose} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.headerRow}>
                <MaterialCommunityIcons name="flag-outline" size={18} color={colors.orange} />
                <Text style={styles.title}>Report Lore</Text>
                <Pressable onPress={handleClose} hitSlop={8} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
              <Text style={styles.subtitle} numberOfLines={2}>
                {activityTitle}
              </Text>
              <Text style={styles.label}>Why are you reporting this?</Text>
              {REASONS.map((reason) => {
                const active = reason === selectedReason;
                return (
                  <Pressable
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    style={[styles.reasonRow, active && styles.reasonRowActive]}
                  >
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={handleSubmit}
                disabled={!selectedReason}
                style={[styles.submitButton, !selectedReason && styles.submitButtonDisabled]}
              >
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    marginLeft: spacing.sm,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12.5,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    ...fonts.label,
    marginBottom: spacing.sm,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  reasonRowActive: {
    borderColor: colors.orange,
    backgroundColor: colors.orangeMuted,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  radioActive: {
    borderColor: colors.orange,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.orange,
  },
  reasonText: {
    color: colors.textPrimary,
    fontSize: 13.5,
  },
  submitButton: {
    backgroundColor: colors.orange,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: colors.textOnOrange,
    fontSize: 14,
    ...fonts.heading,
  },
  confirmWrap: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  confirmTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    marginTop: spacing.md,
  },
  confirmBody: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  doneButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: spacing.xl,
  },
  doneButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    ...fonts.heading,
  },
});
