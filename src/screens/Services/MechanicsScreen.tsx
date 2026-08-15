import React, { useEffect, useState, useCallback } from 'react';
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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServicesStackParamList } from '../../navigation/ServicesStack';

import {
  fetchMechanics,
  setFilters,
  clearErrors,
} from '../../redux/slices/services//mechanicsSlice';

import { SearchBar } from './components/SearchBar';
import { FilterChips, FilterChip } from './components/FilterChips';
import { ScreenHeader } from './components/ScreenHeader';
import { MechanicCard } from './components/mechanics/MechanicCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

const TYPE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All Types' },
  { id: 'Engine', label: 'Engine' },
  { id: 'Electrical', label: 'Electrical' },
  { id: 'Bodywork', label: 'Bodywork' },
  { id: 'Transmission', label: 'Transmission' },
];

export default function MechanicsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const { list, listLoading, listError, filters } = useAppSelector(
    s => s.mechanics,
  );

  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    dispatch(
      fetchMechanics({
        type: activeType,
        lat: undefined,
        lng: undefined,
      }),
    );
    return () => {
      dispatch(clearErrors());
    };
  }, [activeType]);

  const filteredList = list.filter(
    (m: { name: string; specialties: any[] }) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.specialties.some(s => s.toLowerCase().includes(q))
      );
    },
  );

  const handleSearchSubmit = useCallback(() => {
    dispatch(fetchMechanics({ search, type: activeType }));
  }, [search, activeType]);

  const handleTypeChange = (id: string) => {
    setActiveType(id);
  };

  const chipFilters = TYPE_FILTERS.map(f => ({
    ...f,
    active: f.id === activeType,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScreenHeader title="Mechanics Services" />

      <FlatList
        data={filteredList}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search specialized mechanics..."
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            <FilterChips
              filters={chipFilters}
              onFilterPress={handleTypeChange}
            />
          </View>
        }
        renderItem={({ item }) => (
          <MechanicCard
            item={{
              id: item.id,
              name: item.name,
              rating: item.rating,
              distanceMiles: item.distance_km ?? 0,
              imageUri: item.image_url,
              verified: item.verified,
              availableToday: item.available_today,
              specialties: item.specialties,
            }}
            onPress={id =>
              navigation.navigate('MechanicDetail', { mechanicId: id })
            }
            onBookAppointment={() => {}}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
            <Text style={styles.emptyText}>No mechanics found.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 70 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  header: { paddingTop: 8, paddingBottom: 8, gap: 12 },
  separator: { height: 14 },
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
