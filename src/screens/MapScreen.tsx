import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import TopBar from '../components/TopBar';
import PillHeader from '../components/PillHeader';
import { HOME_BASE, Coords } from '../data/activities';
import { useActivities } from '../hooks/useActivities';
import { colors, fonts, radii, shadow, spacing } from '../theme/theme';
import { openInMaps } from '../utils/openInMaps';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Map'>;

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineMiles(a: Coords, b: Coords): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

export default function MapScreen({ navigation }: Props) {
  const { activities, loading, error } = useActivities();
  const [location, setLocation] = useState<Coords>(HOME_BASE);
  const [usingDeviceLocation, setUsingDeviceLocation] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) setPermissionDenied(true);
          return;
        }
        const position = await Location.getCurrentPositionAsync({});
        if (!cancelled) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setUsingDeviceLocation(true);
        }
      } catch {
        if (!cancelled) setPermissionDenied(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return activities
      .map((activity) => ({
        ...activity,
        distanceMiles: haversineMiles(location, activity.coords),
      }))
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
  }, [location, activities]);

  const nearestRadius = sorted.length ? Math.ceil(sorted[sorted.length - 1].distanceMiles) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <TopBar loreBalance={1240} showSearch={false} />
            <PillHeader title="MAP" />

            <View style={[styles.banner, shadow.card]}>
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                size={100}
                color={colors.orange}
                style={styles.bannerWatermark}
              />
              <View style={styles.bannerPin}>
                <MaterialCommunityIcons name="map-marker" size={16} color={colors.textOnOrange} />
              </View>
              <Text style={styles.bannerCount}>{sorted.length} lore ideas nearby</Text>
              <Text style={styles.bannerSub}>
                {usingDeviceLocation
                  ? `Within ${nearestRadius} mi of your location`
                  : permissionDenied
                  ? 'Location unavailable — showing distance from a default area'
                  : 'Finding your location…'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateWrap}>
              <ActivityIndicator color={colors.orange} />
            </View>
          ) : error ? (
            <View style={styles.stateWrap}>
              <Text style={styles.rowMeta}>Couldn't load lore: {error}</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, shadow.soft]}
            onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
          >
            <View style={styles.rowIcon}>
              <MaterialCommunityIcons name={item.icon as any} size={22} color={colors.orange} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.rowMeta}>
                {item.distanceMiles.toFixed(1)} mi · {item.category}
              </Text>
            </View>
            <Pressable
              style={styles.directionsButton}
              onPress={() => openInMaps(item.coords, item.title)}
              hitSlop={8}
            >
              <MaterialCommunityIcons name="directions" size={18} color={colors.orange} />
            </Pressable>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerWrap: {
    marginBottom: spacing.md,
  },
  stateWrap: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  banner: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerWatermark: {
    position: 'absolute',
    right: -16,
    top: -16,
    opacity: 0.12,
  },
  bannerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  bannerCount: {
    color: colors.textPrimary,
    fontSize: 18,
    ...fonts.display,
  },
  bannerSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    ...fonts.heading,
  },
  rowMeta: {
    color: colors.textMuted,
    fontSize: 11.5,
    marginTop: 2,
  },
  directionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.orangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
