import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import SegmentedControl from '../components/SegmentedControl';
import { useAuth } from '../context/AuthContext';
import { useAccent } from '../context/AccentContext';
import { colors, fonts, radii, scrollPhysics, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

type Mode = 'Sign Up' | 'Log In';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function AuthScreen({ navigation }: RootStackScreenProps<'Auth'>) {
  const { signUp, logIn } = useAuth();
  const { palette } = useAccent();
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
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          hitSlop={10}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        decelerationRate={scrollPhysics.decelerationRate}
      >
        <View style={styles.logoWrap}>
          <Image source={require('../../assets/logo-mark.png')} style={styles.logoMark} resizeMode="contain" />
        </View>

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
          <View style={[styles.warningBox, { backgroundColor: palette.muted, borderColor: palette.deep }]}>
            <MaterialCommunityIcons name="information-outline" size={14} color={palette.bright} />
            <Text style={[styles.warningText, { color: palette.bright }]}>
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
          autoCapitalize="none"
          autoCorrect={false}
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
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
            />
          </>
        ) : null}

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        {showEmailExistsHint ? (
          <Pressable onPress={handleLogInInstead} hitSlop={8}>
            <Text style={[styles.linkText, { color: palette.bright }]}>Log in instead</Text>
          </Pressable>
        ) : null}

        <PrimaryButton
          label={mode === 'Sign Up' ? 'Create Account' : 'Log In'}
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitButton}
        />

        {mode === 'Sign Up' ? (
          <Text style={styles.legalText}>
            By creating an account, you agree to our{' '}
            <Text style={[styles.legalLink, { color: palette.bright }]} onPress={() => navigation.navigate('Legal')}>
              Privacy Policy & Terms
            </Text>
            .
          </Text>
        ) : null}

        {mode === 'Log In' ? (
          <Pressable onPress={() => navigation.navigate('ResetPassword')} hitSlop={8}>
            <Text style={[styles.linkText, { color: palette.bright }]}>Forgot password?</Text>
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
  headerSpacer: {
    width: 38,
    height: 38,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    ...fonts.heading,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoMark: {
    width: 26,
    height: 44,
  },
  segmentWrap: {
    marginTop: spacing.lg,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  warningText: {
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
    fontSize: 13,
    ...fonts.heading,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.sm,
    width: '100%',
  },
  legalText: {
    color: colors.textMuted,
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.md,
  },
  legalLink: {
    textDecorationLine: 'underline',
  },
});
