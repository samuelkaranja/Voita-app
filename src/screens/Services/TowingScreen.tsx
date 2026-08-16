import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import { MapPin } from 'lucide-react-native';

import {
  fetchTowingProviders,
  clearErrors,
} from '../../redux/slices/services/towingSlice';

import { FilterChips, FilterChip } from './components/FilterChips';
import { ScreenHeader } from './components/ScreenHeader';
import { EmergencyBanner } from './components/towing/EmergencyBanner';
import { TowingCard } from './components/towing/TowingCard';
import { SafetyFooter } from './components/towing/SafetyFooter';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const TYPE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'flatbed', label: 'Flatbed' },
  { id: 'roadside', label: 'Roadside' },
  { id: 'heavy', label: 'Heavy Duty' },
];

export default function TowingScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const dispatch = useAppDispatch();

  const { list, listLoading, listError } = useAppSelector(s => s.towing);
  const [activeType, setActiveType] = useState('all');

  const NEARBY_RADIUS_KM = 10;

  const {
    enabled: filterByLocation,
    loading: locationLoading,
    coords,
    toggle: toggleNearby,
  } = useDeviceLocation();

  useEffect(() => {
    dispatch(
      fetchTowingProviders({
        type: activeType,
        lat: coords?.lat,
        lng: coords?.lng,
      }),
    );
    return () => {
      dispatch(clearErrors());
    };
  }, [activeType, coords]);

  const filteredList = list
    .filter(t => {
      if (
        filterByLocation &&
        (t.distance_km == null || t.distance_km > NEARBY_RADIUS_KM)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) =>
      filterByLocation
        ? (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity)
        : 0,
    );

  const chipFilters = TYPE_FILTERS.map(f => ({
    ...f,
    active: f.id === activeType,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScreenHeader title="Towing" />

      <FlatList
        data={filteredList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.locationToggle,
                  filterByLocation && styles.locationToggleActive,
                ]}
                onPress={toggleNearby}
                activeOpacity={0.7}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={filterByLocation ? '#FFFFFF' : '#10B981'}
                  />
                ) : (
                  <>
                    <MapPin
                      size={14}
                      color={filterByLocation ? '#FFFFFF' : '#10B981'}
                      strokeWidth={2.5}
                    />
                    <Text
                      style={[
                        styles.locationToggleText,
                        filterByLocation && styles.locationToggleTextActive,
                      ]}
                    >
                      Nearby
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <EmergencyBanner onDispatch={() => {}} />
            <FilterChips
              filters={chipFilters}
              onFilterPress={id => setActiveType(id)}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TowingCard
            item={{
              id: item.id,
              name: item.name,
              rating: item.rating,
              reviewCount: item.review_count,
              distanceKm: item.distance_km,
              etaMin: item.eta_min,
              etaMax: item.eta_max,
              tags: item.tags,
              availability: item.availability,
              isPartner: item.is_partner,
              vehicleType: item.vehicle_type,
            }}
            onDetails={id =>
              navigation.navigate('TowingDetail', { towingId: id })
            }
            onCall={() => {}}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          listLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color="#10B981"
              size="large"
            />
          ) : listError ? (
            <Text style={styles.errorText}>{listError}</Text>
          ) : (
            <Text style={styles.emptyText}>No towing providers found.</Text>
          )
        }
        ListFooterComponent={
          !listLoading && filteredList.length > 0 ? (
            <View style={styles.footer}>
              <SafetyFooter />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 8, gap: 14 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
  },
  locationToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  locationToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  locationToggleTextActive: {
    color: '#FFFFFF',
  },
  footer: { paddingTop: 20, paddingBottom: 60 },
  loader: { marginTop: 48 },
  errorText: {
    textAlign: 'center',
    marginTop: 48,
    color: '#EF4444',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    color: '#9CA3AF',
    fontSize: 14,
  },
});
