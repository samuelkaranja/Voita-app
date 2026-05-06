import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import TagSelector from './components/TagSelector';
import SpeedWidget from './components/SpeedWidget';
import MapViewComponent from './components/MapViewComponent';

import FloodAlertCard from './components/FloodAlertCard';
import CongestionAlertCard from './components/CongestionAlertCard';

import { useLocation } from '../../hooks/useLocation';

export default function HomeScreen() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { location } = useLocation();

  //Alert visibility state
  const [showFloodAlert, setShowFloodAlert] = useState(true);
  const [showCongestionAlert, setShowCongestionAlert] = useState(true);

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

  return (
    <View style={styles.mainContainer}>
      {/* MAP BACKGROUND */}
      <View style={{ flex: 1 }}>
        {initialLocation ? (
          <MapViewComponent location={initialLocation} />
        ) : (
          <View style={styles.centerFull}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 10 }}>Getting GPS Lock...</Text>
          </View>
        )}
      </View>

      {/* OVERLAY STACK */}
      {initialLocation && (
        <View style={styles.centerOverlay} pointerEvents="box-none">
          {/* TAG SELECTOR */}
          <TagSelector selected={selectedTag} setSelected={setSelectedTag} />

          {/* SPEED WIDGET */}
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
