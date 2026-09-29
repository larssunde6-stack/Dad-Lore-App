import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_600SemiBold,
  EBGaramond_700Bold,
  EBGaramond_800ExtraBold,
} from '@expo-google-fonts/eb-garamond';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SavedProvider } from './src/context/SavedContext';
import { CompletionsProvider } from './src/context/CompletionsContext';
import { ActivitiesProvider } from './src/context/ActivitiesContext';
import { AccentProvider, useAccent } from './src/context/AccentContext';
import LevelUpModal from './src/components/LevelUpModal';
import { colors } from './src/theme/theme';

function AppContent() {
  const { isReady } = useAuth();
  const { palette } = useAccent();
  const [fontsLoaded] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_600SemiBold,
    EBGaramond_700Bold,
    EBGaramond_800ExtraBold,
  });

  const navigationTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: colors.background,
        card: colors.surface,
        border: colors.border,
        primary: palette.base,
        text: colors.textPrimary,
      },
    }),
    [palette]
  );

  if (!isReady || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={palette.base} />
      </View>
    );
  }

  return (
    <ActivitiesProvider>
      <SavedProvider>
        <CompletionsProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
          <LevelUpModal />
        </CompletionsProvider>
      </SavedProvider>
    </ActivitiesProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AccentProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AccentProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
