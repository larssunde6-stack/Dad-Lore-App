import { Linking, Platform } from 'react-native';
import { Coords } from '../data/activities';

export async function openInMaps(coords: Coords, label: string) {
  const { latitude, longitude } = coords;
  const encodedLabel = encodeURIComponent(label);
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  if (Platform.OS === 'ios') {
    const appleUrl = `maps://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodedLabel}`;
    const canOpenApple = await Linking.canOpenURL(appleUrl);
    if (canOpenApple) {
      await Linking.openURL(appleUrl);
      return;
    }
  }

  await Linking.openURL(googleUrl);
}
