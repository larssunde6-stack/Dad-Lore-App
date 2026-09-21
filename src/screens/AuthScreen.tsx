import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import SegmentedControl from '../components/SegmentedControl';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

type Mode = 'Sign Up' | 'Log In';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function AuthScreen({ navigation }: RootStackScreenProps<'Auth'>) {
  const { signUp, logIn } = useAuth();
  const [mode, setMode] = useState<Mode>('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorCode, setFormErrorCode] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);
    setFormErrorCode(null);

    if (!EMAIL_RE.test(email.trim())) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'Sign Up' && password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result =
      mode === 'Sign Up' ? await signUp(email.trim(), password) : await logIn(email.trim(), password);
    setSubmitting(false);

    if (result.status === 'error') {
      setFormError(result.message);
      setFormErrorCode(result.code);
      return;
    }

    if (mode === 'Sign Up') {
      navigation.replace('WelcomeUsername');
      return;
    }

    navigation.goBack();
  };

  const handleLogInInstead = () => {
    setMode('Log In');
    setFormError(null);
    setFormErrorCode(null);
  };

  const showEmailExistsHint =
    mode === 'Sign Up' && (formErrorCode === 'email_exists' || formErrorCode === 'user_already_exists');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={10}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Account</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segmentWrap}>
          <SegmentedControl
            options={['Sign Up', 'Log In']}
            value={mode}
            onChange={(value) => {
              setMode(value as Mode);
              setFormError(null);
            }}
          />
        </View>

        {mode === 'Log In' ? (
          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="information-outline" size={14} color={colors.orangeBright} />
            <Text style={styles.warningText}>
              Logging into an existing account will replace your current guest progress on this
              device.
            </Text>
          </View>
        ) : null}

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
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          autoComplete={mode === 'Sign Up' ? 'new-password' : 'current-password'}
          textContentType={mode === 'Sign Up' ? 'newPassword' : 'password'}
        />

        {mode === 'Sign Up' ? (
          <>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Type your password again"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />
          </>
        ) : null}

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        {showEmailExistsHint ? (
          <Pressable onPress={handleLogInInstead} hitSlop={8}>
            <Text style={styles.linkText}>Log in instead</Text>
          </Pressable>
        ) : null}

        <PrimaryButton
          label={mode === 'Sign Up' ? 'Create Account' : 'Log In'}
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitButton}
        />

        {mode === 'Log In' ? (
          <Pressable onPress={() => navigation.navigate('ResetPassword')} hitSlop={8}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>
        ) : null}
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
  segmentWrap: {
    marginTop: spacing.lg,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orangeMuted,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.orangeDeep,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  warningText: {
    color: colors.orangeBright,
    fontSize: 11.5,
    marginLeft: spacing.xs,
    flexShrink: 1,
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
