import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

type Step = 'request' | 'confirm';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function ResetPasswordScreen({ navigation }: RootStackScreenProps<'ResetPassword'>) {
  const { requestPasswordReset, confirmPasswordReset } = useAuth();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleRequestCode = async () => {
    setFormError(null);

    if (!EMAIL_RE.test(email.trim())) {
      setFormError('Enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const result = await requestPasswordReset(email.trim());
    setSubmitting(false);

    if (result.status === 'error') {
      setFormError(result.message);
      return;
    }

    setStep('confirm');
  };

  const handleConfirmReset = async () => {
    setFormError(null);

    if (code.trim().length !== 6) {
      setFormError('Enter the 6-digit code from your email.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFormError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result = await confirmPasswordReset(email.trim(), code.trim(), newPassword);
    setSubmitting(false);

    if (result.status === 'error') {
      setFormError(result.message);
      return;
    }

    navigation.navigate('Tabs');
  };

  const handleBackToEmail = () => {
    setStep('request');
    setCode('');
    setFormError(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Reset Password</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'request' ? (
          <>
            <Text style={styles.body}>
              Enter your account email. If it has an account, we'll send a 6-digit code.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <PrimaryButton
              label="Send Code"
              onPress={handleRequestCode}
              loading={submitting}
              style={styles.submitButton}
            />
          </>
        ) : (
          <>
            <Text style={styles.body}>Enter the code we sent to {email}, and a new password.</Text>

            <Text style={styles.label}>6-Digit Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Type your new password again"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <PrimaryButton
              label="Reset Password"
              onPress={handleConfirmReset}
              loading={submitting}
              style={styles.submitButton}
            />

            <Pressable onPress={handleBackToEmail} hitSlop={8}>
              <Text style={styles.linkText}>Didn't get a code? Try a different email</Text>
            </Pressable>
          </>
        )}
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
    paddingBottom: spacing.xxl,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    ...fonts.heading,
    marginBottom: spacing.xs,
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
  errorText: {
    color: '#E6807A',
    fontSize: 12.5,
    marginBottom: spacing.md,
  },
  linkText: {
    color: colors.orangeBright,
    fontSize: 13,
    ...fonts.heading,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.sm,
    width: '100%',
  },
});
