import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import TagSelector from './components/TagSelector';
import SpeedWidget from './components/SpeedWidget';
import MapViewComponent from './components/MapViewComponent';
import FloodAlertCard from './components/FloodAlertCard';
import CongestionAlertCard from './components/CongestionAlertCard';
import DestinationCard from './components/DestinationCard';

import {
  fetchPetrolStations,
  fetchEmergency,
  fetchSafeRoute,
  fetchNormalRoute,
  clearMapData,
} from '../../redux/slices/map/mapsSlice';

import { useLocation } from '../../hooks/useLocation';

export default function HomeScreen() {
  const dispatch = useDispatch<any>();
  const { location } = useLocation();

  // =========================
  // REDUX STATE (UPDATED)
  // =========================
  const { places, safeRouteCoords, normalRouteCoords, normalRouteInfo } =
    useSelector((state: any) => state.maps);

  const distance = normalRouteInfo?.distance;
  const duration = normalRouteInfo?.duration;

  const destination = useSelector((state: any) => state.maps.destination);

  const routeCoords =
    safeRouteCoords.length > 0 ? safeRouteCoords : normalRouteCoords;

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [initialLocation, setInitialLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [showFloodAlert, setShowFloodAlert] = useState(true);
  const [showCongestionAlert, setShowCongestionAlert] = useState(true);

  useEffect(() => {
    if (location?.coords && !initialLocation) {
      setInitialLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, initialLocation]);

  useEffect(() => {
    if (!destination || !location?.coords) return;

    const { latitude, longitude } = location.coords;

    console.log('🚀 Fetching route with:', {
      origin_lat: latitude,
      origin_lng: longitude,
      destination_lat: destination.latitude,
      destination_lng: destination.longitude,
    });

    dispatch(
      fetchNormalRoute({
        origin_lat: latitude,
        origin_lng: longitude,
        destination_lat: destination.latitude,
        destination_lng: destination.longitude,
      }),
    );
  }, [destination, location, dispatch]);

  useEffect(() => {
    console.log('DESTINATION UPDATED:', destination);
  }, [destination]);

  useEffect(() => {
    console.log('🛣 NORMAL ROUTE COORDS:', normalRouteCoords.length);
  }, [normalRouteCoords]);

  const speed = location?.coords?.speed ?? 0;

  // =========================
  // TAG HANDLER (CORE LOGIC)
  // =========================
  const handleTagSelect = (tag: string) => {
    if (!location?.coords) return;

    const { latitude, longitude } = location.coords;

    dispatch(clearMapData());
    setSelectedTag(tag);

    // -------------------------
    // PETROL
    // -------------------------
    if (tag === 'Petrol') {
      dispatch(fetchPetrolStations({ lat: latitude, lng: longitude }));
      return;
    }

    // -------------------------
    // EMERGENCY
    // -------------------------
    if (tag === 'Emergency') {
      dispatch(fetchEmergency({ lat: latitude, lng: longitude }));
      return;
    }

    // -------------------------
    // LADY FRIENDLY (SAFE ROUTE)
    // -------------------------
    if (tag === 'Lady-Friendly') {
      if (!destination) {
        Toast.show({
          type: 'error',
          text1: 'Destination required',
          text2: 'Please enter where you are going first.',
        });
        return;
      }

      dispatch(
        fetchSafeRoute({
          origin_lat: latitude,
          origin_lng: longitude,
          destination_lat: destination.latitude,
          destination_lng: destination.longitude,
        }),
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* MAP */}
      <View style={{ flex: 1 }}>
        {initialLocation ? (
          <MapViewComponent
            location={initialLocation}
            places={places}
            safeRouteCoords={safeRouteCoords}
            normalRouteCoords={normalRouteCoords}
          />
        ) : (
          <View style={styles.centerFull}>
            <ActivityIndicator size="large" />
            <Text>Getting GPS Lock...</Text>
          </View>
        )}
      </View>

      {/* OVERLAY UI */}
      {initialLocation && (
        <View style={styles.centerOverlay} pointerEvents="box-none">
          <TagSelector
            selected={selectedTag}
            setSelected={setSelectedTag}
            onSelect={handleTagSelect}
          />

          <View style={styles.cardSpacing}>
            <SpeedWidget speed={speed} />
          </View>

          {distance && duration && (
            <View style={styles.routeInfoCard}>
              <Text style={styles.routeDistance}>{distance}</Text>
              <Text style={styles.routeDuration}>{duration}</Text>
            </View>
          )}

          {showFloodAlert && (
            <FloodAlertCard
              title="Flood Alert: Westlands"
              subtitle="Heavy rains near Sarit."
              onClose={() => setShowFloodAlert(false)}
            />
          )}

          {showCongestionAlert && (
            <CongestionAlertCard
              title="Congestion: 12 min delay"
              subtitle="Uhuru Highway traffic."
              onClose={() => setShowCongestionAlert(false)}
            />
          )}
        </View>
      )}

      {/* DESTINATION INPUT */}
      <DestinationCard />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  centerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    top: 20,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cardSpacing: {
    marginTop: 12,
    width: '100%',
  },
  routeInfoCard: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  routeDistance: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d2b1f',
  },

  routeDuration: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});
