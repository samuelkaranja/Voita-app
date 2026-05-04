import { useEffect, useState } from "react";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native";

export const useLocation = () => {
  const [location, setLocation] = useState(null);

  const requestPermission = async () => {
    if (Platform.OS === "ios") {
      const auth = await Geolocation.requestAuthorization("whenInUse");
      return auth === "granted";
    }

    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error("Permission request error:", err);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    let watchId = null;

    const startTracking = async () => {
      const hasPermission = await requestPermission();

      if (!hasPermission) {
        console.warn("Location permission denied");
        return;
      }

      // 1. "WAKE UP" CALL
      // Sometimes watchPosition hangs if the GPS provider is cold.
      // We call getCurrentPosition once to force the hardware to respond.
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("📍 Initial Position Acquired:", position.coords);
          setLocation(position);
        },
        (error) => {
          console.log("❌ Initial Position Error:", error.code, error.message);
        },
        { 
          enableHighAccuracy: false, // Use cellular/wifi for the quick wake-up
          timeout: 15000, 
          maximumAge: 10000 
        }
      );

      // 2. START WATCHING
      watchId = Geolocation.watchPosition(
        (position) => {
          console.log("🛰️ Location Updated:", position.coords.latitude, position.coords.longitude);
          setLocation(position);
        },
        (error) => {
          console.log("❌ Watch Error:", error.code, error.message);
          
          // Error 2 means Location Services (GPS) is toggled OFF on the device
          if (error.code === 2) {
            console.warn("GPS is turned off on the device.");
          }
        },
        {
          // On Android, 'true' can be very strict. If indoors, it may never fire.
          enableHighAccuracy: Platform.OS === 'ios', 
          distanceFilter: 5,         // Update every 5 meters
          interval: 5000,            // (Android) Check every 5 seconds
          fastestInterval: 2000,     // (Android)
          showLocationDialog: true,  // Prompt user to turn on GPS if off
          forceRequestLocation: true,
        }
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
