import React, { useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, StyleSheet } from "react-native";

export default function MapViewComponent({ location }: any) {
  // RULE: Hooks must be at the top, before any returns
  const mapRef = useRef<MapView | null>(null);

  // If data is missing or malformed, return null AFTER hook declaration
  if (!location?.latitude || !location?.longitude) {
    return null;
  }

  const currentRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        // 'region' forces the map to follow the location updates
        region={currentRegion}
        showsUserLocation={true}
        loadingEnabled={true}
      >
        <Marker 
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }} 
          title="Current Position"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Fill the parent (HomeScreen's mainContainer)
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    // Fill this container
    ...StyleSheet.absoluteFillObject,
  },
});
