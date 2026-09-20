import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { FunType, Kind, RiskLevel } from '../data/activities';

export type ActivityFilters = {
  risk: RiskLevel[];
  kind: Kind[];
  funType: FunType[];
};

export const EMPTY_FILTERS: ActivityFilters = { risk: [], kind: [], funType: [] };

export function isFiltersEmpty(filters: ActivityFilters): boolean {
  return filters.risk.length === 0 && filters.kind.length === 0 && filters.funType.length === 0;
}

const RISK_OPTIONS: { value: RiskLevel; label: string; color: string }[] = [
  { value: 'green', label: 'Low', color: colors.riskGreen },
  { value: 'yellow', label: 'Medium', color: colors.riskYellow },
  { value: 'red', label: 'High', color: colors.riskRed },
];

const KIND_OPTIONS: Kind[] = ['Skill', 'Fun'];
const FUN_TYPE_OPTIONS: FunType[] = ['Type 1', 'Type 2'];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

type Props = {
  visible: boolean;
  onClose: () => void;
  value: ActivityFilters;
  onApply: (filters: ActivityFilters) => void;
};

export default function FilterModal({ visible, onClose, value, onApply }: Props) {
  const [draft, setDraft] = useState<ActivityFilters>(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, shadow.card]}>
          <View style={styles.headerRow}>
            <MaterialCommunityIcons name="tune" size={18} color={colors.orange} />
            <Text style={styles.title}>Filter Lore</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <Text style={styles.label}>Danger Level</Text>
          <View style={styles.chipRow}>
            {RISK_OPTIONS.map((option) => {
              const active = draft.risk.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setDraft((d) => ({ ...d, risk: toggle(d.risk, option.value) }))}
                  style={[styles.chip, active && { borderColor: option.color, backgroundColor: `${option.color}26` }]}
                >
                  <View style={[styles.swatch, { backgroundColor: option.color }]} />
                  <Text style={styles.chipText}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Skill or Fun</Text>
          <View style={styles.chipRow}>
            {KIND_OPTIONS.map((option) => {
              const active = draft.kind.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => setDraft((d) => ({ ...d, kind: toggle(d.kind, option) }))}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={styles.chipText}>{option}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Fun Type</Text>
          <View style={styles.chipRow}>
            {FUN_TYPE_OPTIONS.map((option) => {
              const active = draft.funType.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => setDraft((d) => ({ ...d, funType: toggle(d.funType, option) }))}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={styles.chipText}>{option}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => setDraft(EMPTY_FILTERS)}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onApply(draft);
                onClose();
              }}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          </View>
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
    marginBottom: spacing.lg,
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
  label: {
    color: colors.textMuted,
    fontSize: 11,
    ...fonts.label,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: {
    borderColor: colors.orange,
    backgroundColor: colors.orangeMuted,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: 13,
    ...fonts.heading,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  clearButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    ...fonts.heading,
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.orange,
  },
  applyButtonText: {
    color: colors.textOnOrange,
    fontSize: 14,
    ...fonts.heading,
  },
});
