import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';

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
 * Handles the "Nearby" toggle: requests permission + GPS coords on enable,
 * clears coords on disable. The screen is responsible for re-fetching its
 * list with these coords and filtering/sorting by distance_km client-side,
 * per the backend's documented pattern.
 */
export function useDeviceLocation() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      setCoords(null);
      return;
    }

    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) throw new Error('Location permission denied');

      const position = await getCurrentPosition();
      setCoords(position);
      setEnabled(true);
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not get your location',
        text2: e.message ?? 'Please try again',
      });
      setEnabled(false);
      setCoords(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  return { enabled, loading, coords, toggle };
}
