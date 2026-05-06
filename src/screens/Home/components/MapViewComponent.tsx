import React, { useRef, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapViewComponent({ location }: any) {
  const mapRef = useRef<MapView | null>(null);

  if (location?.latitude == null || location?.longitude == null) {
    return null;
  }

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Smooth camera animation
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [location]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }} // Parent controls size
      initialRegion={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      loadingEnabled={true}
    >
      <Marker coordinate={region} title="Start Position" />
    </MapView>
  );
}
