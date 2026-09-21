import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../context/ActivitiesContext';
import { containsBlockedContent } from '../utils/moderation';
import { supabase } from '../lib/supabase';
import { RiskLevel, Kind, FunType } from '../data/activities';
import { colors, fonts, radii, scrollPhysics, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

const ICON_OPTIONS: { name: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { name: 'hiking' },
  { name: 'terrain' },
  { name: 'campfire' },
  { name: 'tent' },
  { name: 'kayaking' },
  { name: 'waves' },
  { name: 'fish' },
  { name: 'snowflake' },
  { name: 'cart-outline' },
  { name: 'bomb' },
  { name: 'trophy-outline' },
  { name: 'run-fast' },
  { name: 'weight-lifter' },
  { name: 'palette-outline' },
  { name: 'music-note-outline' },
  { name: 'food' },
  { name: 'weather-night' },
  { name: 'gymnastics' },
];

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

export default function CreateActivityScreen({ navigation }: RootStackScreenProps<'CreateActivity'>) {
  const { isAnonymous, userId, username, email } = useAuth();
  const { refetch } = useActivities();

  const [icon, setIcon] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [blurb, setBlurb] = useState('');
  const [duration, setDuration] = useState('');
  const [loreRating, setLoreRating] = useState(0);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
  const [kind, setKind] = useState<Kind[]>([]);
  const [funType, setFunType] = useState<FunType | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    if (!icon) {
      setFormError('Pick an icon for your activity.');
      return;
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3 || trimmedTitle.length > 80) {
      setFormError('Give it a title (3-80 characters).');
      return;
    }
    const trimmedBlurb = blurb.trim();
    if (trimmedBlurb.length < 20 || trimmedBlurb.length > 500) {
      setFormError('Add a description (at least 20 characters).');
      return;
    }
    const trimmedDuration = duration.trim();
    if (!trimmedDuration || trimmedDuration.length > 24) {
      setFormError('How long does this take?');
      return;
    }
    if (!riskLevel) {
      setFormError('Pick a danger level.');
      return;
    }
    if (kind.length === 0) {
      setFormError('Pick Skill, Fun, or both.');
      return;
    }
    if (!funType) {
      setFormError('Pick a fun type.');
      return;
    }
    if (loreRating < 1 || loreRating > 5) {
      setFormError('Rate the lore (1-5).');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (parsedTags.length > 5 || parsedTags.some((t) => t.length > 24)) {
      setFormError('Use up to 5 tags, 24 characters each.');
      return;
    }

    if (
      containsBlockedContent(trimmedTitle) ||
      containsBlockedContent(trimmedBlurb) ||
      containsBlockedContent(parsedTags.join(' '))
    ) {
      setFormError("That wording isn't allowed — please revise your title, description, or tags.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('activities')
      .insert({
        title: trimmedTitle,
        icon,
        blurb: trimmedBlurb,
        duration: trimmedDuration,
        lore_rating: loreRating,
        risk_level: riskLevel,
        kind,
        fun_type: funType,
        tags: parsedTags,
        created_by: userId,
        created_by_username: username ?? email ?? 'Guest',
      })
      .select()
      .single();
    setSubmitting(false);

    if (error || !data) {
      setFormError(`Couldn't publish that: ${error?.message ?? 'Unknown error'}`);
      return;
    }

    await refetch();
    navigation.replace('ActivityDetail', { activityId: data.id });
  };

  if (isAnonymous) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
            <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Create Activity</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.gateWrap}>
          <MaterialCommunityIcons name="account-plus-outline" size={28} color={colors.orangeBright} />
          <Text style={styles.gateTitle}>Create an account to publish</Text>
          <Text style={styles.gateBody}>
            Publishing an activity shows your username to everyone, so it needs a real account —
            not a guest identity.
          </Text>
          <PrimaryButton
            label="Create Account"
            onPress={() => navigation.navigate('Auth')}
            style={styles.gateButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Create Activity</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        decelerationRate={scrollPhysics.decelerationRate}
      >
        <Text style={styles.label}>Icon</Text>
        <View style={styles.iconGrid}>
          {ICON_OPTIONS.map((option) => {
            const active = icon === option.name;
            return (
              <Pressable
                key={option.name}
                onPress={() => setIcon(option.name)}
                style={[styles.iconButton, active && styles.iconButtonActive]}
              >
                <MaterialCommunityIcons
                  name={option.name}
                  size={22}
                  color={active ? colors.orangeBright : colors.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Name your activity"
          placeholderTextColor={colors.textMuted}
          maxLength={80}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={blurb}
          onChangeText={setBlurb}
          placeholder="What does it take? Any basic precautions?"
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        <Text style={styles.label}>Duration</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="30 min, 1 hr, Half day..."
          placeholderTextColor={colors.textMuted}
          maxLength={24}
        />

        <Text style={styles.label}>Lore Rating</Text>
        <View style={styles.loreRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Pressable key={i} onPress={() => setLoreRating(i + 1)} hitSlop={6} style={styles.loreIcon}>
              <MaterialCommunityIcons
                name="fire"
                size={28}
                color={i < loreRating ? colors.orange : 'rgba(255,255,255,0.15)'}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Danger Level</Text>
        <View style={styles.chipRow}>
          {RISK_OPTIONS.map((option) => {
            const active = riskLevel === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setRiskLevel(option.value)}
                style={[
                  styles.chip,
                  active && { borderColor: option.color, backgroundColor: `${option.color}26` },
                ]}
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
            const active = kind.includes(option);
            return (
              <Pressable
                key={option}
                onPress={() => setKind((k) => toggle(k, option))}
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
            const active = funType === option;
            return (
              <Pressable
                key={option}
                onPress={() => setFunType(option)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={styles.chipText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Tags (optional)</Text>
        <TextInput
          style={styles.input}
          value={tagsInput}
          onChangeText={setTagsInput}
          placeholder="e.g. High Speed, Late Night"
          placeholderTextColor={colors.textMuted}
        />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <PrimaryButton
          label="Publish Activity"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  gateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  gateTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  gateBody: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  gateButton: {
    width: '100%',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    ...fonts.heading,
    marginBottom: spacing.xs,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconButtonActive: {
    borderColor: colors.orange,
    backgroundColor: colors.orangeMuted,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  loreRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  loreIcon: {
    marginRight: spacing.sm,
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
  errorText: {
    color: '#E6807A',
    fontSize: 12.5,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
    width: '100%',
  },
});
