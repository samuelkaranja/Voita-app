import React, { useRef, useEffect, useMemo } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useDayNight } from '../../../hooks/useDayNight';
import { DAY_MAP_STYLE, NIGHT_MAP_STYLE } from '../../../constants/mapStyles';
import { NAIROBI_SPEED_CAMERAS } from '../../../constants/speedCamerasData';

interface Props {
  location: any;
  places: any[];
  safeRouteCoords: any[];
  normalRouteCoords: any[];
  destination?: {
    latitude: number;
    longitude: number;
    text?: string;
  };
  showCameras?: boolean;
}

export default function MapViewComponent({
  location,
  places,
  safeRouteCoords,
  normalRouteCoords,
  destination,
  showCameras = false,
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  const { isNight } = useDayNight(location?.latitude, location?.longitude);
  const mapStyle = isNight ? NIGHT_MAP_STYLE : DAY_MAP_STYLE;

  /* Safe Region */
  const region = useMemo(() => {
    return {
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }, [location?.latitude, location?.longitude]);

  /* Camera Follow User */
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    mapRef.current?.animateToRegion(region, 1000);
  }, [location?.latitude, location?.longitude, region]);

  /* Destination Validation */
  const hasValidDestination =
    typeof destination?.latitude === 'number' &&
    typeof destination?.longitude === 'number';

  /* Normalize Safe Route */
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

  /* Normalize Normal Route */
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

  /* Active Route */
  const routeToFit = safeRoute.length > 0 ? safeRoute : normalRoute;

  /* Auto-Zoom To Route */
  useEffect(() => {
    if (!routeToFit.length) return;

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(routeToFit, {
        edgePadding: {
          top: 120,
          right: 80,
          bottom: 120,
          left: 80,
        },
        animated: true,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [routeToFit, destination]);

  /* Conditional Render (After Hooks) */
  if (!location?.latitude || !location?.longitude) return null;

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton
      loadingEnabled
      customMapStyle={mapStyle}
    >
      {/* User Location */}
      <Marker coordinate={region} title="You are here" />

      {/* Destination Marker */}
      {hasValidDestination && (
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title="Destination"
          description={destination?.text || 'Your destination'}
          key={`${destination.latitude}-${destination.longitude}`}
        >
          <View style={{ alignItems: 'center' }}>
            {/* Outer glow */}
            <View style={styles.outerglow}>
              {/* Inner pin */}
              <View style={styles.innerpin} />
            </View>
          </View>
        </Marker>
      )}

      {/* Places */}
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

      {/* Speed Camera Markers */}
      {showCameras &&
        NAIROBI_SPEED_CAMERAS.map(cam => (
          <Marker
            key={cam.id}
            coordinate={{ latitude: cam.latitude, longitude: cam.longitude }}
            title={cam.name}
            description={
              cam.speedLimitKph
                ? `Limit: ${cam.speedLimitKph} km/h`
                : 'Speed camera'
            }
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.cameraMarker}>
              <Text style={styles.cameraMarkerSpeed}>
                {cam.speedLimitKph ?? '?'}
              </Text>
            </View>
          </Marker>
        ))}

      {/* Routes */}

      {safeRoute.length > 0 ? (
        <Polyline
          coordinates={safeRoute}
          strokeWidth={2}
          strokeColor="#00C853"
        />
      ) : normalRoute.length > 0 ? (
        <Polyline
          coordinates={normalRoute}
          strokeWidth={2}
          strokeColor="#2979FF"
        />
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  outerglow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 61, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerpin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF3D00',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e53935',
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  cameraMarkerSpeed: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
});
