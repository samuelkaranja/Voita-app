import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

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
  const insets = useSafeAreaInsets();

  const sheetRef = useRef<BottomSheet>(null);

  const prevDestinationRef = useRef<string | null>(null);

  const {
    places,
    safeRouteCoords,
    normalRouteCoords,
    normalRouteInfo,
    safeRouteInfo,
  } = useSelector((state: any) => state.maps);

  const destination = useSelector((state: any) => state.maps.destination);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const isSafeRouteActive =
    selectedTag === 'Lady-Friendly' && safeRouteCoords.length > 0;

  const safety = safeRouteInfo?.safetyInsights;

  const distance = isSafeRouteActive
    ? safeRouteInfo?.distance
    : normalRouteInfo?.distance;

  const duration = isSafeRouteActive
    ? safeRouteInfo?.duration
    : normalRouteInfo?.duration;

  const [initialLocation, setInitialLocation] = useState<any>(null);

  const [showFloodAlert, setShowFloodAlert] = useState(true);
  const [showCongestionAlert, setShowCongestionAlert] = useState(true);

  /* Initial Location */
  useEffect(() => {
    if (location?.coords && !initialLocation) {
      setInitialLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, initialLocation]);

  useEffect(() => {
    if (!destination) return;

    const destinationKey = `${destination.latitude},${destination.longitude}`;

    if (prevDestinationRef.current === destinationKey) return;

    prevDestinationRef.current = destinationKey;

    setSelectedTag(null);
  }, [destination]);

  const speed = location?.coords?.speed ?? 0;

  /* Open Sheet */
  const openSafetySheet = () => {
    console.log('OPEN SHEET CLICKED');
    sheetRef.current?.expand();
  };

  /* Fetch Normal Route */
  useEffect(() => {
    if (!destination || !location?.coords) return;

    if (selectedTag === 'Lady-Friendly') return;
    if (safeRouteCoords.length > 0) return;

    dispatch(
      fetchNormalRoute({
        origin_lat: location.coords.latitude,
        origin_lng: location.coords.longitude,
        destination_lat: destination.latitude,
        destination_lng: destination.longitude,
      }),
    );
  }, [destination, location, selectedTag, safeRouteCoords, dispatch]);

  /* Tag Handler */
  const handleTagSelect = (tag: string) => {
    if (!location?.coords) return;

    const { latitude, longitude } = location.coords;

    if (tag === 'Lady-Friendly' && selectedTag === 'Lady-Friendly') {
      dispatch(clearMapData());

      dispatch(
        fetchNormalRoute({
          origin_lat: latitude,
          origin_lng: longitude,
          destination_lat: destination.latitude,
          destination_lng: destination.longitude,
        }),
      );

      setSelectedTag(null);
      return;
    }

    dispatch(clearMapData());
    setSelectedTag(tag);

    if (tag === 'Petrol') {
      dispatch(fetchPetrolStations({ lat: latitude, lng: longitude }));
      return;
    }

    if (tag === 'Emergency') {
      dispatch(fetchEmergency({ lat: latitude, lng: longitude }));
      return;
    }

    if (tag === 'Lady-Friendly') {
      if (!destination) {
        Toast.show({
          type: 'error',
          text1: 'Destination required',
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

  /* Safety List */
  const safetyItems = useMemo(() => {
    if (!safety) return [];

    return [
      safety.fewerIntersections && 'Fewer complex intersections',
      safety.highActivityAreas && 'Passes through busy public areas',
      safety.avoidsHighRiskZones && 'Avoids low-activity / risky zones',
      safety.congestionAvoided && 'Reduces traffic exposure risk',
    ].filter(Boolean);
  }, [safety]);

  const snapPoints = useMemo(() => ['25%', '45%'], []);

  useEffect(() => {
    console.log('TAG:', selectedTag);
    console.log('SAFE ROUTE:', safeRouteCoords.length);
    console.log('NORMAL ROUTE:', normalRouteCoords.length);
  }, [selectedTag, safeRouteCoords, normalRouteCoords]);

  return (
    <View style={styles.mainContainer}>
      {/* Map */}
      <View style={{ flex: 1 }}>
        {initialLocation ? (
          <MapViewComponent
            location={initialLocation}
            places={places}
            safeRouteCoords={safeRouteCoords}
            normalRouteCoords={normalRouteCoords}
            destination={destination}
          />
        ) : (
          <View style={styles.centerFull}>
            <ActivityIndicator size="large" />
            <Text>Getting GPS Lock...</Text>
          </View>
        )}
      </View>

      {/* Overlay UI */}
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

          {/* Safety Badge */}
          {isSafeRouteActive && (
            <TouchableOpacity
              onPress={openSafetySheet}
              style={styles.safetyBadge}
              activeOpacity={0.7}
            >
              <Text style={styles.safetyBadgeText}>
                🛡 Safe Route Active · Tap for details
              </Text>
            </TouchableOpacity>
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

      {/* Destination */}
      <DestinationCard style={{ bottom: insets.bottom + 95 }} />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#fff' }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Why this route is safer:</Text>

          {safetyItems.length === 0 ? (
            <Text style={styles.sheetEmpty}>No safety data available</Text>
          ) : (
            safetyItems.map((item, index) => (
              <Text key={index} style={styles.sheetItem}>
                • {item}
              </Text>
            ))
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

/* ........ Styles .......... */

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
    top: 10,
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  routeDistance: {
    fontWeight: '700',
  },
  routeDuration: {
    color: '#666',
  },

  safetyBadge: {
    marginTop: 10,
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  safetyBadgeText: {
    fontSize: 12,
    color: '#1B5E20',
    fontWeight: '600',
  },
  sheetContent: {
    padding: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  sheetItem: {
    fontSize: 13,
    marginTop: 6,
    color: '#333333',
  },
  sheetEmpty: {
    fontSize: 13,
    color: '#999',
  },
});
