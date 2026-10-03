import React, { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated, LayoutChangeEvent, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAccent } from '../context/AccentContext';
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
import { colors, pressSpring } from '../theme/theme';
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

const ORB_SIZE = 8;
const SPLASH_SIZE = 36;
// The reveal window's fully-open size — comfortably bigger than
// ICON_SIZE so the growing circular clip fully uncovers the icon
// (rather than permanently cropping its edges) once open.
const REVEAL_SIZE = 28;
// How much of the gap between two tabs (as a fraction, 0-1) is actually
// spent transitioning — color, orb scale, and orb opacity are all flat
// at their resting values for the rest of the gap, so a dragged color
// never smoothly blends/crossfades between tabs. Instead a tab snaps to
// grey almost the instant you leave it, stays flat grey for most of the
// gesture (the "color" only visibly exists in the traveling orb, like
// liquid), and the destination only snaps to its accent color in the
// last sliver of the approach — a hard "paint fill" rather than a fade.
// This also keeps the earlier stuck-faint-label bug structurally
// impossible: any post-settle floating point noise lands deep inside
// the now much wider flat zone, nowhere near this boundary.
const FILL_ZONE = 0.15;

const TAB_BAR_PADDING_TOP = 8;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 68;
const TAB_BAR_PADDING_BOTTOM = Platform.OS === 'ios' ? 28 : 10;
const ICON_SIZE = 24;
const LABEL_HEIGHT = 14;
const COLUMN_HEIGHT = ICON_SIZE + 2 + LABEL_HEIGHT; // icon + its marginTop + label
const CONTENT_HEIGHT = TAB_BAR_HEIGHT - TAB_BAR_PADDING_TOP - TAB_BAR_PADDING_BOTTOM;
const COLUMN_TOP = TAB_BAR_PADDING_TOP + (CONTENT_HEIGHT - COLUMN_HEIGHT) / 2;
const ICON_CENTER_Y = COLUMN_TOP + ICON_SIZE / 2;
const ORB_TOP = ICON_CENTER_Y - ORB_SIZE / 2;
const SPLASH_TOP = ICON_CENTER_Y - SPLASH_SIZE / 2;

type PositionValue = MaterialTopTabBarProps['position'];

// Two overlapping icon layers rotated on the Y axis, cross-fading exactly
// at the 90deg edge-on point — the standard dependency-free "flip card"
// trick. Driven by the same continuous swipe `position` as everything
// else in this bar, so it opens/closes in sync with taps AND live swipes,
// and naturally reverses (closes) as you continue past the Lore tab.
// Both faces always render grey — color comes solely from the shared
// reveal overlay in CustomTabBar, never from this component, so there's
// a single source of truth for "which tab is colored."
function LoreTabIcon({ position, index, involved }: {
  position: PositionValue;
  index: number;
  involved: boolean;
}) {
  if (!involved) {
    return (
      <View style={styles.flipWrap}>
        <MaterialCommunityIcons name={tabIcon.Lore} color={colors.textMuted} size={24} />
      </View>
    );
  }

  const progress = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  const frontRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const frontOpacity = progress.interpolate({ inputRange: [0, 0.5, 0.501, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = progress.interpolate({ inputRange: [0, 0.499, 0.5, 1], outputRange: [0, 0, 1, 1] });

  return (
    <View style={styles.flipWrap}>
      <Animated.View
        style={[styles.flipFace, { opacity: frontOpacity, transform: [{ perspective: 800 }, { rotateY: frontRotate }] }]}
      >
        <MaterialCommunityIcons name={tabIcon.Lore} color={colors.textMuted} size={24} />
      </Animated.View>
      <Animated.View
        style={[styles.flipFace, { opacity: backOpacity, transform: [{ perspective: 800 }, { rotateY: backRotate }] }]}
      >
        <MaterialCommunityIcons name={tabIconActive.Lore} color={colors.textMuted} size={24} />
      </Animated.View>
    </View>
  );
}

function TabBarItemButton({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, ...pressSpring, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(0.88)}
      onPressOut={() => animateTo(1)}
      style={styles.tabBarItem}
      hitSlop={4}
    >
      <Animated.View style={[styles.tabBarItemInner, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
  const { palette } = useAccent();
  const [barWidth, setBarWidth] = useState(0);
  // fromIndexRef holds "the tab we transitioned FROM" for whichever
  // transition is currently in flight, and only gets reassigned when a
  // NEW transition starts (not on every render) — so it stays correct
  // for the tab genuinely being left for that transition's whole
  // duration, letting label color "isInvolved" checks (below) key off
  // the actual transition pair rather than off numeric distance from
  // the final destination, which is what let a tab merely sitting
  // between the old and new index flash colored as `position` swept
  // past its own index en route (e.g. tapping Explore -> Profile would
  // make Lore's label/icon flash since position passes through 1).
  const fromIndexRef = useRef(state.index);
  const lastSeenIndexRef = useRef(state.index);
  const revealSize = useRef(new Animated.Value(0)).current;
  const numTabs = state.routes.length;
  const loreIndex = state.routes.findIndex((r) => r.name === 'Lore');

  useEffect(() => {
    if (lastSeenIndexRef.current === state.index && fromIndexRef.current === state.index) {
      // Initial mount: the starting tab is "focused" with no transition
      // to animate, so its reveal should just start fully open.
      revealSize.setValue(REVEAL_SIZE);
      return;
    }
    if (lastSeenIndexRef.current !== state.index) {
      fromIndexRef.current = lastSeenIndexRef.current;
      lastSeenIndexRef.current = state.index;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // A one-shot "paint fill" reveal on the newly-focused tab's real
      // icon — jumps straight to it (no travel), grows once, and stays
      // open for as long as that tab remains focused (no shrink-back:
      // leaving the tab just moves this overlay away entirely, which
      // reads as the old tab reverting to its always-grey base icon).
      revealSize.setValue(0);
      Animated.spring(revealSize, { toValue: REVEAL_SIZE, friction: 6, useNativeDriver: false }).start();
    }
  }, [state.index, revealSize]);

  const handleLayout = (e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width);

  const tabWidth = numTabs > 0 ? barWidth / numTabs : 0;
  const orbInputRange: number[] = [];
  const orbTranslateRange: number[] = [];
  // Shrink-grow-shrink, with X stretching further than Y at the peak —
  // a cheap squash/stretch cue so the orb reads as a liquid blob moving
  // fast rather than a rigid ball: small right as it leaves a tab
  // (still inside the invisible rest zone, so no visible pop), wide and
  // squat at the midpoint ("condensing" the color it pulled out), small
  // again as it settles into the next tab.
  const orbScaleInputRange: number[] = [];
  const orbScaleXRange: number[] = [];
  const orbScaleYRange: number[] = [];
  // Opacity 0 at every resting tab (and within FILL_ZONE of it) so the
  // orb only exists during an actual transition, never sitting on a tab.
  const orbOpacityInputRange: number[] = [];
  const orbOpacityRange: number[] = [];

  for (let i = 0; i < numTabs; i++) {
    orbInputRange.push(i);
    orbTranslateRange.push((i + 0.5) * tabWidth - ORB_SIZE / 2);

    orbScaleInputRange.push(i);
    orbScaleXRange.push(0.6);
    orbScaleYRange.push(0.6);
    orbOpacityInputRange.push(i);
    orbOpacityRange.push(0);

    if (i < numTabs - 1) {
      orbScaleInputRange.push(i + FILL_ZONE, i + 0.5, i + 1 - FILL_ZONE);
      orbScaleXRange.push(0.9, 2.0, 0.9);
      orbScaleYRange.push(0.8, 1.7, 0.8);
      orbOpacityInputRange.push(i + FILL_ZONE, i + 1 - FILL_ZONE);
      orbOpacityRange.push(1, 1);
    }
  }

  const orbTranslateX = position.interpolate({
    inputRange: orbInputRange,
    outputRange: orbTranslateRange,
  });
  const orbScaleX = position.interpolate({
    inputRange: orbScaleInputRange,
    outputRange: orbScaleXRange,
  });
  const orbScaleY = position.interpolate({
    inputRange: orbScaleInputRange,
    outputRange: orbScaleYRange,
  });
  const orbOpacity = position.interpolate({
    inputRange: orbOpacityInputRange,
    outputRange: orbOpacityRange,
  });

  const focusedRouteName = state.routes[state.index].name as keyof TabParamList;
  const revealIconName = focusedRouteName === 'Lore' ? tabIconActive.Lore : tabIconActive[focusedRouteName];

  return (
    <View style={styles.tabBar} onLayout={handleLayout}>
      {barWidth > 0 ? (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.orb,
              {
                opacity: orbOpacity,
                transform: [{ translateX: orbTranslateX }, { scaleX: orbScaleX }, { scaleY: orbScaleY }],
              },
            ]}
          >
            <LinearGradient
              colors={palette.gradientFab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.orbFill}
            />
          </Animated.View>
          <View
            pointerEvents="none"
            style={[styles.reveal, { left: (state.index + 0.5) * tabWidth - SPLASH_SIZE / 2 }]}
          >
            <Animated.View style={[styles.revealClip, { width: revealSize, height: revealSize }]}>
              <MaterialCommunityIcons name={revealIconName} color={palette.base} size={ICON_SIZE} />
            </Animated.View>
          </View>
        </>
      ) : null}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = (options.tabBarLabel as string | undefined) ?? route.name;
        const routeName = route.name as keyof TabParamList;
        // Only the two tabs genuinely part of the current transition
        // (the destination, and the one we just left) ever use the
        // position-driven interpolation. A tab a skip-tap merely sweeps
        // past numerically is never evaluated against `position` at
        // all, so it can't flash colored no matter what value `position`
        // takes on its way to the real destination.
        const isInvolved = index === state.index || index === fromIndexRef.current;

        const tintColor = isInvolved
          ? position.interpolate({
              inputRange: [index - 1, index - FILL_ZONE, index, index + FILL_ZONE, index + 1],
              outputRange: [
                colors.textMuted,
                colors.textMuted,
                palette.base,
                colors.textMuted,
                colors.textMuted,
              ],
              extrapolate: 'clamp',
            })
          : colors.textMuted;

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
          <TabBarItemButton key={route.key} onPress={onPress}>
            <View style={styles.iconWrap}>
              {routeName === 'Lore' && loreIndex >= 0 ? (
                <LoreTabIcon position={position} index={loreIndex} involved={isInvolved} />
              ) : (
                <MaterialCommunityIcons
                  name={focused ? tabIconActive[routeName] : tabIcon[routeName]}
                  color={colors.textMuted}
                  size={24}
                />
              )}
            </View>
            <Animated.Text style={[styles.tabBarLabel, { color: tintColor }]}>{label}</Animated.Text>
          </TabBarItemButton>
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
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: TAB_BAR_HEIGHT,
    paddingTop: TAB_BAR_PADDING_TOP,
    paddingBottom: TAB_BAR_PADDING_BOTTOM,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    height: LABEL_HEIGHT,
    lineHeight: LABEL_HEIGHT,
    marginTop: 2,
  },
  iconWrap: {
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    top: ORB_TOP,
    left: 0,
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    overflow: 'hidden',
  },
  orbFill: {
    width: '100%',
    height: '100%',
  },
  reveal: {
    position: 'absolute',
    top: SPLASH_TOP,
    left: 0,
    width: SPLASH_SIZE,
    height: SPLASH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealClip: {
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipFace: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
