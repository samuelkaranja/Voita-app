import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { SearchBar } from './components/SearchBar';
import { FilterChips, FilterChip } from './components/FilterChips';
import {
  MechanicCard,
  MechanicItem,
} from './components/mechanics/MechanicCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServicesStackParamList } from '../../navigation/ServicesStack';

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

// Data

const TYPE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All Types' },
  { id: 'engine', label: 'Engine' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'bodywork', label: 'Bodywork' },
  { id: 'transmission', label: 'Transmission' },
];

const MECHANICS: MechanicItem[] = [
  {
    id: 'm1',
    name: 'Elite Precision Motors',
    rating: 4.9,
    distanceMiles: 1.2,
    imageUri:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
    verified: true,
    availableToday: true,
    specialties: ['BMW Specialist', 'Engine Tuning'],
  },
  {
    id: 'm2',
    name: 'Volt & Wire Electrical',
    rating: 4.7,
    distanceMiles: 2.5,
    imageUri:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80',
    verified: true,
    availableToday: false,
    specialties: ['EV Specialist', 'Electrical'],
  },
  {
    id: 'm3',
    name: 'Masterform Bodywork',
    rating: 5.0,
    distanceMiles: 0.8,
    imageUri:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
    verified: true,
    availableToday: false,
    specialties: ['Paintless Dent Repair', 'Luxe Paint'],
  },
  {
    id: 'm4',
    name: 'Shift-Right Gearbox Co.',
    rating: 4.8,
    distanceMiles: 3.1,
    imageUri:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    verified: true,
    availableToday: true,
    specialties: ['Auto Transmission', 'ZF Certified'],
  },
];

export default function MechanicsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');

  const filters = TYPE_FILTERS.map(f => ({
    ...f,
    active: f.id === activeType,
  }));

  const filteredMechanics = MECHANICS.filter(m => {
    const matchesSearch =
      search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      activeType === 'all' ||
      m.specialties.some(s =>
        s.toLowerCase().includes(activeType.toLowerCase()),
      );

    return matchesSearch && matchesType;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <FlatList
        data={filteredMechanics}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search specialized mechanics..."
            />
            <FilterChips
              filters={filters}
              onFilterPress={id => setActiveType(id)}
            />
          </View>
        }
        renderItem={({ item }) => (
          <MechanicCard
            item={item}
            onPress={id =>
              navigation.navigate('MechanicDetail', { mechanicId: id })
            }
            onBookAppointment={id => {
              // open booking flow
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  separator: {
    height: 14,
  },
});
