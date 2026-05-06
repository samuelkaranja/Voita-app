import { useEffect, useState } from 'react';

import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

import { PermissionsAndroid, Platform } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState<GeoPosition | null>(null);

  const requestPermission = async () => {
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
        console.error('Permission request error:', err);

        return false;
      }
    }

    return false;
  };

  useEffect(() => {
    let watchId: number | null = null;

    const startTracking = async () => {
      const hasPermission = await requestPermission();

      if (!hasPermission) {
        console.warn('Location permission denied');
        return;
      }

      // Initial GPS fetch
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          console.log('Initial Position Acquired:', position.coords);

          setLocation(position);
        },

        error => {
          console.log('Initial Position Error:', error.code, error.message);
        },

        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        },
      );

      // Start watching location
      watchId = Geolocation.watchPosition(
        (position: GeoPosition) => {
          console.log(
            '🛰️ Location Updated:',
            position.coords.latitude,
            position.coords.longitude,
          );

          setLocation(position);
        },

        error => {
          console.log('Watch Error:', error.code, error.message);

          if (error.code === 2) {
            console.warn('GPS is turned off on the device.');
          }
        },

        {
          enableHighAccuracy: Platform.OS === 'ios',
          distanceFilter: 5,
          interval: 5000,
          fastestInterval: 2000,
          showLocationDialog: true,
          forceRequestLocation: true,
        },
      );
    };

    startTracking();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { location };
};
