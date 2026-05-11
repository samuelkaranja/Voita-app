import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import TagSelector from './components/TagSelector';
import SpeedWidget from './components/SpeedWidget';
import MapViewComponent from './components/MapViewComponent';

import FloodAlertCard from './components/FloodAlertCard';
import CongestionAlertCard from './components/CongestionAlertCard';

import {
  fetchPetrolStations,
  fetchEmergency,
  fetchSafeRoute,
} from '../../redux/slices/map/mapsSlice';

import { useLocation } from '../../hooks/useLocation';

export default function HomeScreen() {
  const dispatch = useDispatch<any>();
  const { location } = useLocation();

  const { places, routeCoords } = useSelector((state: any) => state.maps);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Alert visibility
  const [showFloodAlert, setShowFloodAlert] = useState(true);
  const [showCongestionAlert, setShowCongestionAlert] = useState(true);

  // Initial map location (important for stable rendering)
  const [initialLocation, setInitialLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (location?.coords && !initialLocation) {
      setInitialLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, initialLocation]);

  const speed = location?.coords?.speed ?? 0;

  //NEW: Tag handler (Redux integration)
  const handleTagSelect = (tag: string) => {
    console.log('SELECTED TAG:', tag);

    setSelectedTag(tag);

    if (!location?.coords) {
      console.log('NO LOCATION');
      return;
    }

    const { latitude, longitude } = location.coords;

    console.log('LOCATION:', latitude, longitude);

    if (tag === 'Petrol') {
      console.log('FETCH PETROL');
      dispatch(fetchPetrolStations({ lat: latitude, lng: longitude }));
    }

    if (tag === 'Emergency') {
      console.log('FETCH EMERGENCY');
      dispatch(fetchEmergency({ lat: latitude, lng: longitude }));
    }

    if (tag === 'Lady-Friendly') {
      console.log('FETCH ROUTE');
      dispatch(
        fetchSafeRoute({
          origin_lat: latitude,
          origin_lng: longitude,
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
            routeCoords={routeCoords}
          />
        ) : (
          <View style={styles.centerFull}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Getting GPS Lock...</Text>
          </View>
        )}
      </View>

      {/* OVERLAY UI */}
      {initialLocation && (
        <View style={styles.centerOverlay} pointerEvents="box-none">
          {/* TAG SELECTOR */}
          <TagSelector
            selected={selectedTag}
            setSelected={setSelectedTag}
            onSelect={handleTagSelect}
          />

          {/* SPEED */}
          <View style={styles.cardSpacing}>
            <SpeedWidget speed={speed} />
          </View>

          {/* FLOOD ALERT */}
          {showFloodAlert && (
            <FloodAlertCard
              title="Flood Alert: Westlands"
              subtitle="Heavy rains near Sarit. Water logging reported."
              onClose={() => setShowFloodAlert(false)}
            />
          )}

          {/* CONGESTION ALERT */}
          {showCongestionAlert && (
            <CongestionAlertCard
              title="Congestion: 12 min delay"
              subtitle="Standard traffic flow on Uhuru Highway"
              onClose={() => setShowCongestionAlert(false)}
            />
          )}
        </View>
      )}
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
});
