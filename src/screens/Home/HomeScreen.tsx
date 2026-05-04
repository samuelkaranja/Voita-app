import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import TagSelector from "./components/TagSelector";
import SpeedWidget from "./components/SpeedWidget";
import MapViewComponent from "./components/MapViewComponent";
import { useLocation } from "../../hooks/useLocation";

export default function HomeScreen() {
  const [selectedTag, setSelectedTag] = useState(null);
  const { location } = useLocation();

  // Sanitize location data: Ensure we are passing clean numbers to the Map
  const formattedLocation = location?.coords
    ? {
        latitude: parseFloat(location.coords.latitude),
        longitude: parseFloat(location.coords.longitude),
      }
    : null;

  const speed = location?.coords?.speed ?? 0;

  return (
    <View style={styles.mainContainer}>
      {/* BACKGROUND LAYER: The Map */}
      {formattedLocation ? (
        <MapViewComponent 
          key="active-google-map" 
          location={formattedLocation} 
        />
      ) : (
        <View style={styles.centerFull}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Getting GPS Lock...</Text>
        </View>
      )}

      {/* FOREGROUND LAYER: UI Widgets */}
      <View style={styles.uiOverlay} pointerEvents="box-none">
        {formattedLocation && (
          <>
            <TagSelector 
              selected={selectedTag} 
              setSelected={setSelectedTag} 
            />
            <SpeedWidget speed={speed} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  centerFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uiOverlay: {
    // Fills the screen but 'box-none' allows touches to pass through to the map
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end", // Push widgets to the bottom
    paddingBottom: 40,
    alignItems: "center",
  },
});
