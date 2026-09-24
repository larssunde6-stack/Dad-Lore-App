import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ExploreScreen from '../screens/ExploreScreen';
// MapScreen import intentionally removed — its data model (device-distance
// to curated coordinates) no longer compiles against the location-less
// Activity type (see PRD §5b). The file itself is untouched on disk and
// excluded from the TS build in tsconfig.json; re-import it here once
// Map's data model is rebuilt.
import LoreScreen from '../screens/LoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import LegalScreen from '../screens/LegalScreen';
import AuthScreen from '../screens/AuthScreen';
import WelcomeUsernameScreen from '../screens/WelcomeUsernameScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import CreateActivityScreen from '../screens/CreateActivityScreen';
import { colors } from '../theme/theme';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialTopTabNavigator<TabParamList>();

const tabIcon: Record<keyof TabParamList, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Explore: 'compass-outline',
  Map: 'map-outline',
  Lore: 'notebook-outline',
  Profile: 'account-outline',
};

const tabIconActive: Record<keyof TabParamList, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Explore: 'compass',
  Map: 'map',
  Lore: 'book-open-page-variant-outline',
  Profile: 'account',
};

function CustomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = (options.tabBarLabel as string | undefined) ?? route.name;
        const routeName = route.name as keyof TabParamList;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabBarItem} hitSlop={4}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={focused ? tabIconActive[routeName] : tabIcon[routeName]}
                color={focused ? colors.orange : colors.textMuted}
                size={24}
              />
            </View>
            <Text style={[styles.tabBarLabel, { color: focused ? colors.orange : colors.textMuted }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        lazy: true,
        swipeEnabled: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      {/* Map tab paused for MVP — true geo-discovery ("find hills near
          me") isn't solved by the current fixed-coordinate approach.
          MapScreen.tsx is untouched; re-add this line when ready. */}
      {/* <Tab.Screen name="Map" component={MapScreen} /> */}
      <Tab.Screen name="Lore" component={LoreScreen} options={{ tabBarLabel: 'Your Lore' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const pushedScreenOptions = {
  animation: 'slide_from_right' as const,
  gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  fullScreenGestureEnabled: true,
};

const authModalScreenOptions = {
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
  gestureEnabled: false,
};

const welcomeUsernameScreenOptions = {
  animation: 'slide_from_right' as const,
  gestureEnabled: false,
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={pushedScreenOptions}
      />
      <Stack.Screen name="Legal" component={LegalScreen} options={pushedScreenOptions} />
      <Stack.Screen name="Auth" component={AuthScreen} options={authModalScreenOptions} />
      <Stack.Screen
        name="WelcomeUsername"
        component={WelcomeUsernameScreen}
        options={welcomeUsernameScreenOptions}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={pushedScreenOptions}
      />
      <Stack.Screen
        name="CreateActivity"
        component={CreateActivityScreen}
        options={pushedScreenOptions}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
