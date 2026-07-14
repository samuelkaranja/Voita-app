import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wrench,
  PaintBucket,
  Armchair,
  Stethoscope,
  Car,
  Droplets,
  Truck,
  GraduationCap,
  UserRound,
} from 'lucide-react-native';

import { SearchBar } from './components/SearchBar';
import { FilterChips, FilterChip } from './components/FilterChips';
import { CategoryCard, CategoryItem } from './components/CategoryCard';
import { SpecialistCard, SpecialistItem } from './components/SpecialistCard';
import {
  NearbyServiceCard,
  NearbyServiceItem,
} from './components/NearbyServiceCard';
import { SectionHeader } from './components/SectionHeader';
import { MapFAB } from './components/MapFAB';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServicesStackParamList } from '../../navigation/ServicesStack';

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

const CATEGORY_ROUTES: Partial<Record<string, keyof ServicesStackParamList>> = {
  mechanics: 'MechanicsScreen',
  towing: 'TowingScreen',
  carwash: 'CarWashScreen',
  scouts: 'ScoutsScreen',
};

const FILTERS: FilterChip[] = [
  { id: 'category', label: 'Category', hasDropdown: true, active: true },
  { id: 'location', label: 'Location' },
  { id: 'rating', label: 'Rating' },
  { id: 'verified', label: 'Verified', hasIcon: true },
];

const CATEGORIES: CategoryItem[] = [
  { id: 'mechanics', label: 'Mechanics', Icon: Wrench },
  { id: 'carwash', label: 'Car Wash', Icon: Droplets },
  { id: 'towing', label: 'Towing', Icon: Truck },
  { id: 'scouts', label: 'Scout', Icon: UserRound },
];

const TOP_SPECIALISTS: SpecialistItem[] = [
  {
    id: 'sp1',
    name: 'Precision Auto Care',
    rating: 4.8,
    distanceKm: 2.3,
    imageUri:
      'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&q=80',
    verified: true,
  },
  {
    id: 'sp2',
    name: 'Elite Paint Studio',
    rating: 4.7,
    distanceKm: 3.1,
    imageUri:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&q=80',
    verified: true,
  },
  {
    id: 'sp3',
    name: 'ProDrive Garage',
    rating: 4.6,
    distanceKm: 4.5,
    imageUri:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    verified: false,
  },
];

const NEARBY_SERVICES: NearbyServiceItem[] = [
  {
    id: 'ns1',
    name: 'Downtown Mechanics',
    category: 'Mechanic',
    rating: 4.7,
    reviewCount: 128,
    distanceKm: 1.5,
    imageUri:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&q=80',
    verified: true,
  },
  {
    id: 'ns2',
    name: 'Sparkle Express Wash',
    category: 'Car Wash',
    rating: 4.5,
    reviewCount: 312,
    distanceKm: 2.8,
    imageUri:
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=300&q=80',
    verified: true,
  },
  {
    id: 'ns3',
    name: 'Rapid Towing Co.',
    category: 'Towing',
    rating: 4.9,
    reviewCount: 94,
    distanceKm: 5.0,
    imageUri:
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&q=80',
    verified: true,
  },
];

export default function ServicesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('category');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryPress = (id: string) => {
    setActiveCategory(prev => (prev === id ? null : id));
    const route = CATEGORY_ROUTES[id];
    if (route) navigation.navigate(route);
  };

  const filters = FILTERS.map(f => ({ ...f, active: f.id === activeFilter }));
  const categories = CATEGORIES.map(c => ({
    ...c,
    active: c.id === activeCategory,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* <SearchBar value={search} onChangeText={setSearch} /> */}

        {/* <FilterChips
          filters={filters}
          onFilterPress={id => setActiveFilter(id)}
        /> */}

        <View style={styles.section}>
          <SectionHeader title="Categories" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowGap}
          >
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                item={cat}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.specialistSection}>
          <SectionHeader title="Top Rated Specialists" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowGap}
          >
            {TOP_SPECIALISTS.map(sp => (
              <SpecialistCard key={sp.id} item={sp} onPress={() => {}} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Nearby Services" />
          <View style={styles.nearbyList}>
            {NEARBY_SERVICES.map(svc => (
              <NearbyServiceCard
                key={svc.id}
                item={svc}
                onPress={() => {}}
                onViewDetails={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <MapFAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  section: {
    gap: 14,
  },
  specialistSection: {
    gap: 14,
    marginHorizontal: -16,
    paddingLeft: 16,
  },
  rowGap: {
    gap: 10,
    paddingRight: 20,
    paddingVertical: 5,
  },
  nearbyList: {
    gap: 12,
  },
});
