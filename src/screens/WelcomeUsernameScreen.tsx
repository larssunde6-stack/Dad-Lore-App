import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

const USERNAME_RE = /^[a-zA-Z0-9_]{2,24}$/;

export default function WelcomeUsernameScreen({ navigation }: RootStackScreenProps<'WelcomeUsername'>) {
  const { updateUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);

    if (!USERNAME_RE.test(username.trim())) {
      setFormError('Username must be 2-24 characters (letters, numbers, underscores).');
      return;
    }

    setSubmitting(true);
    const result = await updateUsername(username.trim());
    setSubmitting(false);

    if (result.status === 'error') {
      setFormError(result.message);
      return;
    }

    navigation.navigate('Tabs');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Lore.</Text>
        <Text style={styles.subtitle}>What should we call you?</Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Pick a username"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          maxLength={24}
          autoFocus
        />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <PrimaryButton
          label="Let's Go"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    ...fonts.display,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.xl,
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
  submitButton: {
    width: '100%',
  },
});
