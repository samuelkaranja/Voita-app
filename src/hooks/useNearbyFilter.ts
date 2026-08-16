import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1';

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'Voita needs your location to find nearby services.',
      buttonPositive: 'Allow',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

/**
 * category: exact backend category string (confirmed via curl: "Mechanic",
 * "Car Wash"; "Towing" assumed from the /nearby categories list, not yet
 * confirmed against a real record). Omit for Explore, which spans all
 * categories.
 */
export function useNearbyFilter(category?: string, radiusKm = 10) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nearbyIds, setNearbyIds] = useState<Set<string> | null>(null);

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      setNearbyIds(null);
      return;
    }

    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) throw new Error('Location permission denied');

      const { lat, lng } = await getCurrentPosition();

      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius_km: String(radiusKm),
      });
      if (category) params.append('category', category);

      const res = await fetch(
        `${BASE_URL}/service-providers/nearby?${params.toString()}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const ids = new Set<string>(
        (data.providers ?? []).map((p: { id: string }) => p.id),
      );

      if (ids.size === 0) {
        Toast.show({
          type: 'info',
          text1: 'No providers found nearby',
          text2: `Nothing within ${radiusKm}km of your location`,
        });
      }

      setNearbyIds(ids);
      setEnabled(true);
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not filter by location',
        text2: e.message ?? 'Please try again',
      });
      setEnabled(false);
      setNearbyIds(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, category, radiusKm]);

  return { enabled, loading, nearbyIds, toggle };
}
