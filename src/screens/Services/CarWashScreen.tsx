import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from './components/SearchBar';
import { FilterChips, FilterChip } from './components/FilterChips';
import { MapFAB } from './components/MapFAB';
import { CarWashCard, CarWashItem } from './components/carwash/CarWashCard';
import { WeeklyPassBanner } from './components/carwash/WeeklyPassBanner';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useNavigation } from '@react-navigation/native';

const TYPE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All Centers' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'full', label: 'Full Detail' },
];

const CAR_WASHES: CarWashItem[] = [
  {
    id: 'cw1',
    name: 'Pristine Auto Spa',
    rating: 4.9,
    priceTier: '$$',
    distanceKm: 4.8,
    area: 'Main Avenue',
    imageUri:
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80',
    waitMins: 15,
    verified: true,
    tags: [{ label: 'Full Detail' }, { label: 'Eco-Wax' }],
  },
  {
    id: 'cw2',
    name: 'EcoStream Wash',
    rating: 4.7,
    priceTier: '$',
    distanceKm: 2.1,
    area: 'Green District',
    imageUri:
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80',
    waitMins: 5,
    verified: false,
    tags: [{ label: 'Exterior' }, { label: 'Waterless', highlighted: true }],
  },
  {
    id: 'cw3',
    name: 'Signature Detail Co.',
    rating: 5.0,
    priceTier: '$$$',
    distanceKm: 6.5,
    area: 'Downtown',
    imageUri:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
    waitMins: 45,
    verified: false,
    tags: [{ label: 'Ceramic Coating' }, { label: 'Interior Pro' }],
  },
];

export default function CarWashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');

  const filters = TYPE_FILTERS.map(f => ({
    ...f,
    active: f.id === activeType,
  }));

  const filtered = CAR_WASHES.filter(w => {
    const matchesSearch =
      search.trim() === '' ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.area.toLowerCase().includes(search.toLowerCase()) ||
      w.tags.some(t => t.label.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      activeType === 'all' ||
      w.tags.some(t =>
        t.label.toLowerCase().includes(activeType.toLowerCase()),
      );

    return matchesSearch && matchesType;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search centers near you..."
            />
            <FilterChips
              filters={filters}
              onFilterPress={id => setActiveType(id)}
            />
          </View>
        }
        renderItem={({ item }) => (
          <CarWashCard
            item={item}
            onPress={id =>
              navigation.navigate('CarWashDetail', { carWashId: id })
            }
            onBookService={id => {
              /* open booking flow */
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <WeeklyPassBanner onLearnMore={() => {}} />
          </View>
        }
      />
      <MapFAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  footer: {
    paddingTop: 14,
    paddingBottom: 60,
  },
});
