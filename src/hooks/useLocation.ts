import { useEffect, useState } from 'react';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState<GeoPosition | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }

    return false;
  };

  useEffect(() => {
    let watchId: number;

    const startTracking = async () => {
      const hasPermission = await requestPermission();

      if (!hasPermission) {
        console.warn('Location permission denied');
        return;
      }

      // Initial position
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          setLocation(position);
        },
        error => {
          console.log('Initial error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );

      // Watch position
      watchId = Geolocation.watchPosition(
        (position: GeoPosition) => {
          setLocation(position);
        },
        error => {
          console.log('Watch error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 5,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    };

    startTracking();

    return () => {
      if (watchId !== undefined) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { location };
};
