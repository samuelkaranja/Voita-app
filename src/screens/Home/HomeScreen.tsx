import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import TagSelector from './components/TagSelector';
import SpeedWidget from './components/SpeedWidget';
import MapViewComponent from './components/MapViewComponent';
import { useLocation } from '../../hooks/useLocation';

export default function HomeScreen() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { location } = useLocation();

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
      {/* 🗺️ MAP BACKGROUND */}
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

      {/* 🎯 OVERLAY STACK */}
      {initialLocation && (
        <View style={styles.centerOverlay} pointerEvents="box-none">
          {/* Tag Selector */}
          <TagSelector selected={selectedTag} setSelected={setSelectedTag} />

          {/* Speed Widget (below TagSelector) */}
          <View style={{ marginTop: 12, width: '100%' }}>
            <SpeedWidget speed={speed} />
          </View>
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
    top: 60,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
