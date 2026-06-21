import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { FilterChips, FilterChip } from './components/FilterChips';
import { MapFAB } from './components/MapFAB';
import { EmergencyBanner } from './components/towing/EmergencyBanner';
import { TowingCard, TowingItem } from './components/towing/TowingCard';
import { SafetyFooter } from './components/towing/SafetyFooter';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';

const TYPE_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'flatbed', label: 'Flatbed' },
  { id: 'roadside', label: 'Roadside' },
  { id: 'heavy', label: 'Heavy Duty' },
];

const TOWING_PROVIDERS: TowingItem[] = [
  {
    id: 't1',
    name: 'RapidTow Pro',
    rating: 4.9,
    reviewCount: 1200,
    distanceKm: 2.4,
    etaMin: 15,
    etaMax: 20,
    tags: ['Flatbed', 'Winching'],
    availability: 'available',
    isPartner: true,
    vehicleType: 'flatbed',
  },
  {
    id: 't2',
    name: 'Titan Heavy Duty',
    rating: 4.7,
    reviewCount: 850,
    distanceKm: 4.1,
    etaMin: 25,
    etaMax: 35,
    tags: ['Heavy Duty', 'Recovery'],
    availability: 'available',
    isPartner: false,
    vehicleType: 'heavy',
  },
  {
    id: 't3',
    name: 'City Roadside Help',
    rating: 4.5,
    reviewCount: 420,
    distanceKm: 1.8,
    etaMin: 45,
    etaMax: 55,
    tags: ['Tire Change', 'Battery'],
    availability: 'busy',
    isPartner: false,
    vehicleType: 'roadside',
  },
];

export default function TowingScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const [activeType, setActiveType] = useState('all');

  const filters = TYPE_FILTERS.map(f => ({
    ...f,
    active: f.id === activeType,
  }));

  const filtered = TOWING_PROVIDERS.filter(
    p => activeType === 'all' || p.vehicleType === activeType,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <EmergencyBanner onDispatch={() => {}} />
            <FilterChips
              filters={filters}
              onFilterPress={id => setActiveType(id)}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TowingCard
            item={item}
            onDetails={id =>
              navigation.navigate('TowingDetail', { towingId: id })
            }
            onCall={id => {
              /* open phone dialer */
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <SafetyFooter />
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
    gap: 14,
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 60,
  },
});
