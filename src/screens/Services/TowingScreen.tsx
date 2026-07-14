import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';

import {
  fetchTowingProviders,
  clearErrors,
} from '../../redux/slices/services/towingSlice';

import { FilterChips, FilterChip } from './components/FilterChips';
import { ScreenHeader } from './components/ScreenHeader';
import { MapFAB } from './components/MapFAB';
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

  useEffect(() => {
    dispatch(fetchTowingProviders({ type: activeType }));
    return () => {
      dispatch(clearErrors());
    };
  }, [activeType]);

  const chipFilters = TYPE_FILTERS.map(f => ({
    ...f,
    active: f.id === activeType,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScreenHeader title="Towing" />

      <FlatList
        data={list}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
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
              distanceKm: item.distance_km ?? 0,
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
          !listLoading && list.length > 0 ? (
            <View style={styles.footer}>
              <SafetyFooter />
            </View>
          ) : null
        }
      />

      <MapFAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 8, gap: 14 },
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
