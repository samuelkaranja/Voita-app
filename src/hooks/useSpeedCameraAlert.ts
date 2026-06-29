import { useMemo } from 'react';
import {
  NAIROBI_SPEED_CAMERAS,
  SpeedCamera,
} from '../constants/speedCamerasData';

const ALERT_RADIUS_METERS = 500;

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export interface NearbyCamera extends SpeedCamera {
  distanceMeters: number;
}

export function useSpeedCameraAlert(
  userLat?: number,
  userLng?: number,
): NearbyCamera[] {
  return useMemo(() => {
    if (!userLat || !userLng) return [];

    return NAIROBI_SPEED_CAMERAS.map(cam => ({
      ...cam,
      distanceMeters: haversineMeters(
        userLat,
        userLng,
        cam.latitude,
        cam.longitude,
      ),
    }))
      .filter(cam => cam.distanceMeters <= ALERT_RADIUS_METERS)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [userLat, userLng]);
}
