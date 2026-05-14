import React, { useRef, useEffect, useMemo } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface Props {
  location: any;
  places: any[];
  safeRouteCoords: any[];
  normalRouteCoords: any[];
}

export default function MapViewComponent({
  location,
  places,
  safeRouteCoords,
  normalRouteCoords,
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  if (!location?.latitude || !location?.longitude) return null;

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // =========================
  // CAMERA FOLLOW USER
  // =========================
  useEffect(() => {
    mapRef.current?.animateToRegion(region, 1000);
  }, [location.latitude, location.longitude]);

  // =========================
  // NORMALIZE SAFE ROUTE
  // =========================
  const safeRoute = useMemo(() => {
    if (!Array.isArray(safeRouteCoords)) return [];

    return safeRouteCoords
      .map((c: any) =>
        c?.latitude && c?.longitude
          ? c
          : Array.isArray(c)
          ? { latitude: c[1], longitude: c[0] }
          : null,
      )
      .filter(Boolean);
  }, [safeRouteCoords]);

  // =========================
  // NORMALIZE NORMAL ROUTE
  // =========================
  const normalRoute = useMemo(() => {
    if (!Array.isArray(normalRouteCoords)) return [];

    return normalRouteCoords
      .map((c: any) =>
        c?.latitude && c?.longitude
          ? c
          : Array.isArray(c)
          ? { latitude: c[1], longitude: c[0] }
          : null,
      )
      .filter(Boolean);
  }, [normalRouteCoords]);

  // =========================
  // ACTIVE ROUTE
  // =========================
  const activeRoute = safeRoute.length > 0 ? safeRoute : normalRoute;

  // =========================
  // 🔥 AUTO-ZOOM TO ROUTE (IMPORTANT UX FIX)
  // =========================
  useEffect(() => {
    if (!activeRoute.length) return;

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(activeRoute, {
        edgePadding: {
          top: 120,
          right: 80,
          bottom: 120,
          left: 80,
        },
        animated: true,
      });
    }, 500); // gives map time to render polyline

    return () => clearTimeout(timeout);
  }, [activeRoute]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton
      loadingEnabled
    >
      {/* USER LOCATION */}
      <Marker coordinate={region} title="You are here" />

      {/* PLACES */}
      {places.map((place: any, index: number) => {
        const latitude = place?.lat ?? place?.geometry?.location?.lat;
        const longitude = place?.lng ?? place?.geometry?.location?.lng;

        if (latitude == null || longitude == null) return null;

        return (
          <Marker
            key={`place-${index}`}
            coordinate={{ latitude, longitude }}
            title={place?.name}
            description={place?.vicinity}
          />
        );
      })}

      {/* ROUTE */}
      {activeRoute.length > 0 && (
        <Polyline
          coordinates={activeRoute}
          strokeWidth={4}
          strokeColor="#0d2b1f"
        />
      )}
    </MapView>
  );
}
