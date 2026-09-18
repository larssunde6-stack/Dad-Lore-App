import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ExploreScreen from '../screens/ExploreScreen';
import MapScreen from '../screens/MapScreen';
import LoreScreen from '../screens/LoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import LegalScreen from '../screens/LegalScreen';
import { colors } from '../theme/theme';
import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => (
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name={focused ? tabIconActive[route.name] : tabIcon[route.name]}
              color={color}
              size={size}
            />
            {focused ? <View style={styles.activeDot} /> : null}
          </View>
        ),
      })}
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

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Legal"
        component={LegalScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  activeDot: {
    marginTop: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.orange,
  },
});
