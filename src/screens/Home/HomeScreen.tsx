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
import { Bell } from 'lucide-react-native';

import TagSelector from './components/TagSelector';
import MapViewComponent from './components/MapViewComponent';
import DestinationCard from './components/DestinationCard';

import {
  fetchPetrolStations,
  fetchEmergency,
  fetchSafeRoute,
  fetchNormalRoute,
  clearMapData,
} from '../../redux/slices/map/mapsSlice';

import { useLocation } from '../../hooks/useLocation';
import { useDayNight } from '../../hooks/useDayNight';

/* ........ Types ........ */

interface Alert {
  id: string;
  type: 'flood' | 'congestion';
  title: string;
  subtitle: string;
}

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
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'flood',
      type: 'flood',
      title: 'Flood Alert: Westlands',
      subtitle: 'Heavy rains near Sarit.',
    },
    {
      id: 'congestion',
      type: 'congestion',
      title: 'Congestion: 12 min delay',
      subtitle: 'Uhuru Highway traffic.',
    },
  ]);

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

  /* Initial Location */
  useEffect(() => {
    if (location?.coords && !initialLocation) {
      setInitialLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, initialLocation]);

  /* Reset tag on new destination */
  useEffect(() => {
    if (!destination) return;

    const destinationKey = `${destination.latitude},${destination.longitude}`;

    if (prevDestinationRef.current === destinationKey) return;

    prevDestinationRef.current = destinationKey;

    setSelectedTag(null);
  }, [destination]);

  const speed = location?.coords?.speed ?? 0;

  const { isNight } = useDayNight(
    location?.coords?.latitude,
    location?.coords?.longitude,
  );

  /* Open Sheet */
  const openSafetySheet = () => {
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

    if (selectedTag === tag) {
      dispatch(clearMapData());
      setSelectedTag(null);

      if (destination && tag !== 'Lady-Friendly') {
        dispatch(
          fetchNormalRoute({
            origin_lat: latitude,
            origin_lng: longitude,
            destination_lat: destination.latitude,
            destination_lng: destination.longitude,
          }),
        );
      }

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
        Toast.show({ type: 'error', text1: 'Destination required' });
        setSelectedTag(null);
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

  /* Dismiss Alert */
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
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

      {/* Top Overlay */}
      {initialLocation && (
        <View style={styles.overlay} pointerEvents="box-none">
          {/* Top row — TagSelector only */}
          <View style={styles.topRow}>
            <TagSelector
              selected={selectedTag}
              setSelected={setSelectedTag}
              onSelect={handleTagSelect}
            />
          </View>

          {/* Night badge */}
          {isNight && (
            <View style={styles.nightBadge}>
              <Text style={styles.nightBadgeText}>🌙 Night Mode Active</Text>
            </View>
          )}

          {/* Route info */}
          {distance && duration && (
            <View style={styles.routeInfoCard}>
              <Text style={styles.routeDistance}>{distance}</Text>
              <Text style={styles.routeDuration}>{duration}</Text>
            </View>
          )}

          {/* Safety badge */}
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
        </View>
      )}

      {/* Bottom Right — Bell + Alerts + Speed */}
      {initialLocation && (
        <View style={[styles.bottomRight, { bottom: insets.bottom + 170 }]}>
          {/* Alerts panel — expands upward */}
          {alertsExpanded && alerts.length > 0 && (
            <View style={styles.alertsPanel}>
              {/* Speed header inside panel */}
              <View style={styles.alertsPanelHeader}>
                <Text style={styles.alertsPanelSpeed}>
                  {speed ? Math.round(speed * 3.6) : 0}
                </Text>
                <Text style={styles.alertsPanelSpeedUnit}>km/h</Text>
                <Text style={styles.alertsPanelTitle}>Live Alerts</Text>
              </View>

              <View style={styles.alertsDivider} />

              {alerts.map(alert => (
                <View key={alert.id} style={styles.alertRow}>
                  <Text style={styles.alertIcon}>
                    {alert.type === 'flood' ? '🌧' : '🚧'}
                  </Text>
                  <View style={styles.alertText}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertSubtitle}>{alert.subtitle}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDismissAlert(alert.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.alertClose}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Bell button only — no SpeedWidget beside it */}
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => setAlertsExpanded(prev => !prev)}
            activeOpacity={0.8}
          >
            <Bell size={20} color="#fff" />
            {alerts.length > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{alerts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Destination */}
      <DestinationCard style={{ bottom: insets.bottom + 95 }} />

      {/* Safety Bottom Sheet */}
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

/* ........ Styles ........ */

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

  /* Top Overlay */
  overlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
    elevation: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  /* Night */
  nightBadge: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: '#1a1a2e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#304a7d',
  },
  nightBadgeText: {
    fontSize: 12,
    color: '#8ec3b9',
    fontWeight: '600',
  },

  /* Route info */
  routeInfoCard: {
    marginTop: 10,
    alignSelf: 'center',
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

  /* Safety badge */
  safetyBadge: {
    marginTop: 10,
    alignSelf: 'center',
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

  /* Bottom Right */
  bottomRight: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
    zIndex: 20,
    elevation: 20,
  },

  alertsPanelHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  alertsPanelSpeed: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0d2b1f',
  },
  alertsPanelSpeedUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8ff6d0',
    backgroundColor: 'rgba(13, 43, 31, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  alertsPanelTitle: {
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
  },
  alertsDivider: {
    height: 0.5,
    backgroundColor: '#f0f0f0',
    marginBottom: 4,
  },

  /* Bell */
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(13, 43, 31, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },

  /* Alerts panel */
  alertsPanel: {
    marginBottom: 10,
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  alertIcon: {
    fontSize: 18,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#001810',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 11,
    color: '#555',
  },
  alertClose: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 4,
  },

  /* Bottom sheet */
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
