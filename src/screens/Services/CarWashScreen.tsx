import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useDeviceLocation } from '../../hooks/useDeviceLocation';
import {
  fetchCarWashes,
  clearErrors,
} from '../../redux/slices/services/carWashSlice';
import { MapPin } from 'lucide-react-native';

import { SearchBar } from './components/SearchBar';
import { FilterChips, FilterChip } from './components/FilterChips';
import { ScreenHeader } from './components/ScreenHeader';
import { CarWashCard } from './components/carwash/CarWashCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const TYPE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All Centers' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'full', label: 'Full Detail' },
];

export default function CarWashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const dispatch = useAppDispatch();

  const { list, listLoading, listError } = useAppSelector(s => s.carwash);

  const [search, setSearch] = useState('');
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
      fetchCarWashes({ type: activeType, lat: coords?.lat, lng: coords?.lng }),
    );
    return () => {
      dispatch(clearErrors());
    };
  }, [activeType, coords]);

  const handleSearchSubmit = useCallback(() => {
    dispatch(
      fetchCarWashes({
        search,
        type: activeType,
        lat: coords?.lat,
        lng: coords?.lng,
      }),
    );
  }, [search, activeType, coords]);

  const filteredList = list
    .filter(w => {
      if (
        filterByLocation &&
        (w.distance_km == null || w.distance_km > NEARBY_RADIUS_KM)
      ) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.area.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
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
      <ScreenHeader title="Car Wash" />
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
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search centers near you..."
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            <FilterChips
              filters={chipFilters}
              onFilterPress={id => setActiveType(id)}
            />
          </View>
        }
        renderItem={({ item }) => (
          <CarWashCard
            item={{
              id: item.id,
              name: item.name,
              rating: item.rating,
              distanceKm: item.distance_km,
              area: item.area,
              imageUri: item.image_url,
              waitMins: item.wait_time_mins,
              verified: item.verified,
              tags: item.tags.map(t => ({ label: t })),
            }}
            onPress={id =>
              navigation.navigate('CarWashDetail', { carWashId: id })
            }
            onBookService={() => {}}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
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
            <Text style={styles.emptyText}>No car wash centers found.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 70 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 8, gap: 12 },
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
