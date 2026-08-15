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
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Bell } from 'lucide-react-native';

import TagSelector from './components/TagSelector';
import MapViewComponent from './components/MapViewComponent';
import DestinationCard from './components/DestinationCard';

import {
  fetchPetrolStations,
  fetchEmergency,
  fetchSafeRoute,
  fetchNormalRoute,
  fetchFloodAlerts,
  fetchCongestionAlerts,
  clearMapData,
  setDestination,
} from '../../redux/slices/map/mapsSlice';

import { useLocation } from '../../hooks/useLocation';
import { useDayNight } from '../../hooks/useDayNight';
import { useSpeedCameraAlert } from '../../hooks/useSpeedCameraAlert';
import { useRouteCache } from '../../hooks/useRouteCache';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

import { useTurnByTurn } from '../../hooks/useTurnByTurn';
import { useVoiceGuide } from '../../hooks/useVoiceGuide';
import TurnByTurnBanner from './components/TurnByTurnBanner';
import { useTabBarClearance } from '../../components/CustomTabBar';

/* ........ Types ........ */

interface Alert {
  id: string;
  type: 'flood' | 'congestion' | 'camera';
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
    floodAlerts,
    congestionAlerts,
    steps,
  } = useSelector((state: any) => state.maps);

  const destination = useSelector((state: any) => state.maps.destination);

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Flood and Congestion Alerts
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const nearbyCameras = useSpeedCameraAlert(
    location?.coords?.latitude,
    location?.coords?.longitude,
  );

  const alerts = useMemo(() => {
    const flood = floodAlerts.map((a: any) => ({
      id: a.id,
      type: 'flood' as const,
      title: a.title,
      subtitle: a.subtitle,
    }));

    const congestion = congestionAlerts.map((a: any) => ({
      id: a.id,
      type: 'congestion' as const,
      title: a.title,
      subtitle: a.subtitle,
    }));

    const cameras = nearbyCameras.map(cam => ({
      id: cam.id,
      type: 'camera' as const,
      title: `📷 Speed Camera – ${cam.name}`,
      subtitle: cam.speedLimitKph
        ? `Limit: ${cam.speedLimitKph} km/h · ${Math.round(
            cam.distanceMeters,
          )}m ahead`
        : `Speed camera ahead · ${Math.round(cam.distanceMeters)}m`,
    }));

    return [...cameras, ...flood, ...congestion].filter(
      a => !dismissedAlerts.includes(a.id),
    );
  }, [floodAlerts, congestionAlerts, nearbyCameras, dismissedAlerts]);

  const isSafeRouteActive =
    selectedTag === 'Lady-Friendly' && safeRouteCoords.length > 0;

  const showCameras = selectedTag === 'Speed Cameras';

  const {
    currentStep,
    nextStep,
    currentStepIndex,
    totalSteps,
    isLastStep,
    hasSteps,
    distanceToNextMeters,
  } = useTurnByTurn(
    steps,
    location?.coords?.latitude,
    location?.coords?.longitude,
  );

  useVoiceGuide(
    isNavigating ? currentStep : null,
    isNavigating ? nextStep : null,
    currentStepIndex,
    isNavigating ? distanceToNextMeters : null,
    isLastStep,
    isNavigating && hasSteps,
  );

  const tabBarClearance = useTabBarClearance();

  const safety = safeRouteInfo?.safetyInsights;

  const distance = isSafeRouteActive
    ? safeRouteInfo?.distance
    : normalRouteInfo?.distance;

  const duration = isSafeRouteActive
    ? safeRouteInfo?.duration
    : normalRouteInfo?.duration;

  const [initialLocation, setInitialLocation] = useState<any>(null);

  const userPhone = useSelector((state: any) => state.auth.user?.phone);
  const { isOnline } = useNetworkStatus();
  const { saveCache, loadCache } = useRouteCache(userPhone);

  /* Initial Location */
  useEffect(() => {
    if (location?.coords && !initialLocation) {
      setInitialLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, initialLocation]);

  // Restore cached route on cold start when offline
  useEffect(() => {
    if (isOnline) return;
    if (normalRouteCoords.length > 0) return; // already have a route

    loadCache().then(cached => {
      if (!cached) return;

      dispatch(setDestination(cached.destination));
      dispatch({
        type: 'maps/fetchNormalRoute/fulfilled',
        payload: {
          coords: cached.normalRouteCoords,
          distance: cached.normalRouteInfo.distance,
          duration: cached.normalRouteInfo.duration,
        },
      });

      Toast.show({
        type: 'info',
        text1: '📦 Offline mode',
        text2: `Showing cached route to ${cached.destination.text}`,
      });
    });
  }, [isOnline]);

  // Save route to cache whenever a new normal route is fetched
  useEffect(() => {
    if (!destination) return;
    if (normalRouteCoords.length === 0) return;
    if (!normalRouteInfo.distance) return;

    saveCache({
      destination,
      normalRouteCoords,
      normalRouteInfo: {
        distance: normalRouteInfo.distance,
        duration: normalRouteInfo.duration,
      },
    });
  }, [normalRouteCoords]);

  /* Reset tag on new destination */
  useEffect(() => {
    if (!destination) return;

    const destinationKey = `${destination.latitude},${destination.longitude}`;

    if (prevDestinationRef.current === destinationKey) return;

    prevDestinationRef.current = destinationKey;

    setSelectedTag(null);
    setIsNavigating(false);
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
  }, [
    destination?.latitude,
    destination?.longitude,
    selectedTag,
    safeRouteCoords.length,
    dispatch,
  ]);

  /* Fetch dynamic alerts on location change */
  useEffect(() => {
    if (!location?.coords) return;

    const { latitude, longitude } = location.coords;

    dispatch(fetchFloodAlerts({ lat: latitude, lng: longitude }));
    dispatch(fetchCongestionAlerts({ lat: latitude, lng: longitude }));
  }, [location?.coords?.latitude, location?.coords?.longitude, dispatch]);

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
          isNight,
        }),
      );
    }

    if (tag === 'Speed Cameras') {
      // No fetch needed — just the tag toggle drives showCameras
      return;
    }
  };

  /* Dismiss Alert */
  const handleDismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  /* Safety List */
  const safetyItems = useMemo(() => {
    if (!safety) return [];

    const items: { icon: string; label: string; sub?: string }[] = [];

    if (safety.fewerIntersections)
      items.push({ icon: '🛣', label: 'Fewer complex intersections' });

    if (safety.highActivityAreas)
      items.push({ icon: '👥', label: 'Passes through busy public areas' });

    if (safety.avoidsHighRiskZones)
      items.push({ icon: '🚫', label: 'Avoids low-activity / risky zones' });

    if (safety.congestionAvoided)
      items.push({ icon: '🚦', label: 'Reduces traffic exposure risk' });

    if (safety.litEstablishments > 0)
      items.push({
        icon: '💡',
        label: 'Well-lit corridor',
        sub: `${safety.litEstablishments} lit establishment${
          safety.litEstablishments > 1 ? 's' : ''
        } nearby`,
      });

    if (safety.washroomStops?.length > 0)
      items.push({
        icon: '🚻',
        label: 'Washroom stops along the route',
        sub: safety.washroomStops.join(' · '),
      });

    if (safety.openNowCount > 0)
      items.push({
        icon: '🏪',
        label: 'Active area',
        sub: `${safety.openNowCount} place${
          safety.openNowCount > 1 ? 's' : ''
        } currently open`,
      });

    if (safety.waypointName)
      items.push({
        icon: '📍',
        label: 'Routed via safe anchor',
        sub: safety.waypointName,
      });

    if (safety.nightMode)
      items.push({
        icon: '🌙',
        label: 'Night scoring active',
        sub: 'Lit establishments weighted higher',
      });

    return items;
  }, [safety]);

  const snapPoints = useMemo(() => ['30%', '65%', '90%'], []);

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
            showCameras={showCameras}
            currentStepLocation={currentStep?.startLocation ?? null}
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
        <View
          style={[styles.overlay, { top: insets.top + 10 }]}
          pointerEvents="box-none"
        >
          {/* Top row — TagSelector only */}
          <View style={styles.topRow}>
            <TagSelector
              selected={selectedTag}
              setSelected={setSelectedTag}
              onSelect={handleTagSelect}
            />
          </View>

          {/* Offline banner */}
          {!isOnline && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineBannerText}>
                📡 No connection · Showing cached route
              </Text>
            </View>
          )}

          {/* Night badge */}
          {/* {isNight && (
            <View style={styles.nightBadge}>
              <Text style={styles.nightBadgeText}>🌙 Night Mode Active</Text>
            </View>
          )} */}

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

          {/* Start Navigation button — shown when route is ready but not yet navigating */}
          {hasSteps && !isNavigating && (
            <TouchableOpacity
              style={styles.startNavButton}
              onPress={() => setIsNavigating(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.startNavButtonText}>▶ Start Navigation</Text>
            </TouchableOpacity>
          )}

          {/* Turn-by-turn banner — shown only during active navigation */}
          {hasSteps && isNavigating && currentStep && (
            <TurnByTurnBanner
              currentStep={currentStep}
              nextStep={nextStep}
              distanceToNextMeters={distanceToNextMeters}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              isLastStep={isLastStep}
            />
          )}
        </View>
      )}

      {/* Bottom Right — Bell + Alerts + Speed */}
      {initialLocation && (
        <View style={[styles.bottomRight, { bottom: tabBarClearance + 75 }]}>
          {/* Alerts panel — expands upward */}
          {alertsExpanded && (
            <View style={styles.alertsPanel}>
              {/* Speed header */}
              <View style={styles.alertsPanelHeader}>
                <Text style={styles.alertsPanelSpeed}>
                  {speed ? Math.round(speed * 3.6) : 0}
                </Text>
                <Text style={styles.alertsPanelSpeedUnit}>km/h</Text>
                <Text style={styles.alertsPanelTitle}>Live Alerts</Text>
              </View>

              <View style={styles.alertsDivider} />

              {/* Alerts list or empty state */}
              {alerts.length === 0 ? (
                <Text style={styles.alertsEmpty}>No alerts in your area</Text>
              ) : (
                alerts.map(alert => (
                  <View key={alert.id} style={styles.alertRow}>
                    <Text style={styles.alertIcon}>
                      {alert.type === 'flood'
                        ? '🌧'
                        : alert.type === 'camera'
                        ? '📷'
                        : '🚧'}
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
                ))
              )}
            </View>
          )}

          {/* Bell button with badge */}
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
      <DestinationCard style={{ bottom: tabBarClearance }} />

      {/* Safety Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#fff' }}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Why this route is safer</Text>
            {safety?.nightMode && (
              <View style={styles.sheetNightBadge}>
                <Text style={styles.sheetNightBadgeText}>🌙 Night mode</Text>
              </View>
            )}
          </View>

          {/* Detour pill */}
          {safety?.detourRatio != null && safety.detourRatio > 1 && (
            <View style={styles.detourPill}>
              <Text style={styles.detourPillText}>
                {Math.round((safety.detourRatio - 1) * 100)}% longer than direct
                — worth it for safety
              </Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.sheetDivider} />

          {safetyItems.length === 0 ? (
            <Text style={styles.sheetEmpty}>No safety data available</Text>
          ) : (
            safetyItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.sheetRow,
                  index === safetyItems.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.sheetIconWrap}>
                  <Text style={styles.sheetIcon}>{item.icon}</Text>
                </View>
                <View style={styles.sheetRowText}>
                  <Text style={styles.sheetItem}>{item.label}</Text>
                  {item.sub && <Text style={styles.sheetSub}>{item.sub}</Text>}
                </View>
              </View>
            ))
          )}
        </BottomSheetScrollView>
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
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
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
  /* Alerts panel */
  alertsPanel: {
    marginBottom: 10,
    width: 270,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  alertsPanelHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  alertsPanelSpeed: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0d2b1f',
  },
  alertsPanelSpeedUnit: {
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
  },
  alertsDivider: {
    height: 0.5,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#001810',
    marginBottom: 3,
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
  },
  alertClose: {
    fontSize: 15,
    color: '#999',
    paddingHorizontal: 4,
  },
  alertsEmpty: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 12,
  },

  /* Bottom sheet */
  sheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d2b1f',
  },
  sheetNightBadge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  sheetNightBadgeText: {
    fontSize: 11,
    color: '#8ec3b9',
    fontWeight: '600',
  },
  detourPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  detourPillText: {
    fontSize: 11,
    color: '#1B5E20',
    fontWeight: '600',
  },
  sheetDivider: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  sheetIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetIcon: {
    fontSize: 16,
  },
  sheetRowText: {
    flex: 1,
    justifyContent: 'center',
  },
  sheetItem: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sheetSub: {
    fontSize: 11,
    color: '#666',
    marginTop: 3,
    lineHeight: 16,
  },
  sheetEmpty: {
    fontSize: 13,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  offlineBanner: {
    marginTop: 8,
    alignSelf: 'center',
    backgroundColor: '#37474F',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  startNavButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#0d2b1f',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  startNavButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8ff6d0',
    letterSpacing: 0.5,
  },
});
