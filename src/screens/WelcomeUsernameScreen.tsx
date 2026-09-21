import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radii, spacing } from '../theme/theme';
import { RootStackScreenProps } from '../navigation/types';

const USERNAME_RE = /^[a-zA-Z0-9_]{2,24}$/;

export default function WelcomeUsernameScreen({ navigation }: RootStackScreenProps<'WelcomeUsername'>) {
  const { updateUsername, logOut } = useAuth();
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

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

  const handleBack = async () => {
    setLeaving(true);
    await logOut();
    setLeaving(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} disabled={leaving} style={styles.backButton} hitSlop={10}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity: entrance,
            transform: [
              {
                scale: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              },
            ],
          }}
        >
          <Text style={styles.title}>Welcome to Lore.</Text>
          <Text style={styles.subtitle}>What should we call you?</Text>
        </Animated.View>

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
  header: {
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    ...fonts.display,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
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
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
  },
});
