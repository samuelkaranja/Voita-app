import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wrench,
  Droplets,
  Truck,
  UserRound,
  MapPin,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchExploreData,
  ServiceCategory,
} from '../../redux/slices/services/exploreSlice';

import { CategoryCard, CategoryItem } from './components/CategoryCard';
import { SpecialistCard } from './components/SpecialistCard';
import { NearbyServiceCard } from './components/NearbyServiceCard';
import { SectionHeader } from './components/SectionHeader';
import { CategoryBadge } from './components/CategoryBadge';
import { MapFAB } from './components/MapFAB';

type NavigationProp = NativeStackNavigationProp<ServicesStackParamList>;

const CATEGORY_ROUTES: Partial<Record<string, keyof ServicesStackParamList>> = {
  mechanics: 'MechanicsScreen',
  towing: 'TowingScreen',
  carwash: 'CarWashScreen',
  scouts: 'ScoutsScreen',
};

const CATEGORIES: CategoryItem[] = [
  { id: 'mechanics', label: 'Mechanics', Icon: Wrench },
  { id: 'carwash', label: 'Car Wash', Icon: Droplets },
  { id: 'towing', label: 'Towing', Icon: Truck },
  { id: 'scouts', label: 'Scout', Icon: UserRound },
];

// Map explore category → detail screen route
const DETAIL_ROUTES: Record<ServiceCategory, keyof ServicesStackParamList> = {
  mechanic: 'MechanicDetail',
  carwash: 'CarWashDetail',
  towing: 'TowingDetail',
  scout: 'ScoutProfile',
};

// Map explore category → param key
const PARAM_KEYS: Record<ServiceCategory, string> = {
  mechanic: 'mechanicId',
  carwash: 'carWashId',
  towing: 'towingId',
  scout: 'scoutId',
};

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [filterByLocation, setFilterByLocation] = useState(false);

  const { topRated, recentlyAdded, loading, error } = useAppSelector(
    s => s.explore,
  );

  useEffect(() => {
    dispatch(fetchExploreData());
  }, []);

  const handleCategoryPress = (id: string) => {
    const route = CATEGORY_ROUTES[id];
    if (route) navigation.navigate(route as any);
  };

  const handleProviderPress = (id: string, category: ServiceCategory) => {
    const route = DETAIL_ROUTES[category];
    const paramKey = PARAM_KEYS[category];
    navigation.navigate(route as any, { [paramKey]: id });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* Screen header tag */}
      <View style={styles.headerTag}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Explore</Text>
            <Text style={styles.headerSubtitle}>Find services near you</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.locationToggle,
              filterByLocation && styles.locationToggleActive,
            ]}
            onPress={() => setFilterByLocation(prev => !prev)}
            activeOpacity={0.7}
          >
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
              Near me
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title="Categories" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowGap}
          >
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.id}
                item={cat}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator
            color="#10B981"
            size="large"
            style={styles.loader}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {/* Top Rated Specialists */}
            {topRated.length > 0 && (
              <View style={styles.specialistSection}>
                <SectionHeader title="Top Rated Specialists" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rowGap}
                >
                  {topRated.map(sp => (
                    <SpecialistCard
                      key={`${sp.category}-${sp.id}`}
                      item={{
                        id: sp.id,
                        name: sp.name,
                        rating: sp.rating,
                        distanceKm: sp.distance_km ?? 0,
                        imageUri: sp.image_url,
                        verified: sp.verified,
                      }}
                      onPress={() => handleProviderPress(sp.id, sp.category)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Recently Added */}
            {recentlyAdded.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Recently Added" />
                <View style={styles.nearbyList}>
                  {recentlyAdded.map(svc => (
                    <NearbyServiceCard
                      key={`${svc.category}-${svc.id}`}
                      item={{
                        id: svc.id,
                        name: svc.name,
                        category: svc.category,
                        rating: svc.rating,
                        reviewCount: 0,
                        distanceKm: svc.distance_km ?? 0,
                        imageUri: svc.image_url,
                        verified: svc.verified,
                      }}
                      onPress={() => handleProviderPress(svc.id, svc.category)}
                      onViewDetails={() =>
                        handleProviderPress(svc.id, svc.category)
                      }
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}

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
  },
  headerTag: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  section: { gap: 14 },
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
  nearbyList: { gap: 12 },
  loader: { marginTop: 32 },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#EF4444',
    fontSize: 14,
  },
});
