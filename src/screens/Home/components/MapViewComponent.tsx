import React, { useRef, useEffect } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface Props {
  location: any;
  places: any[];
  routeCoords: any[];
}

export default function MapViewComponent({
  location,
  places,
  routeCoords,
}: Props) {
  const mapRef = useRef<MapView | null>(null);

  // Ensure location exists
  if (location?.latitude == null || location?.longitude == null) {
    return null;
  }

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Smooth camera animation (KEEP THIS)
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [location]);

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      loadingEnabled={true}
    >
      {/* USER START MARKER */}
      <Marker coordinate={region} title="Start Position" />

      {/* PLACES FROM BACKEND */}
      {places?.map((place: any, index: number) => (
        <Marker
          key={index}
          coordinate={{
            latitude: place.lat,
            longitude: place.lng,
          }}
          title={place.name}
          description={place.vicinity}
        />
      ))}

      {/* SAFE ROUTE */}
      {routeCoords?.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeWidth={4}
          strokeColor="#0d2b1f"
        />
      )}
    </MapView>
  );
}
