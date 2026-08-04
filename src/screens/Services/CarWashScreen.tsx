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
import { Plus } from 'lucide-react-native';
import {
  fetchCarWashes,
  suggestCarWash,
  clearErrors,
} from '../../redux/slices/services/carWashSlice';

import { SearchBar } from './components/SearchBar';
import { FilterChips, FilterChip } from './components/FilterChips';
import { ScreenHeader } from './components/ScreenHeader';
import { CarWashCard } from './components/carwash/CarWashCard';
import { SuggestCarWashModal } from './components/carwash/SuggestCarWashModal';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useTabBarClearance } from '../../components/CustomTabBar';

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
  const tabBarClearance = useTabBarClearance();

  const { list, listLoading, listError } = useAppSelector(s => s.carwash);

  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [suggestModalVisible, setSuggestModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCarWashes({ type: activeType }));
    return () => {
      dispatch(clearErrors());
    };
  }, [activeType]);

  const handleSearchSubmit = useCallback(() => {
    dispatch(fetchCarWashes({ search, type: activeType }));
  }, [search, activeType]);

  const filteredList = list.filter(w => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.area.toLowerCase().includes(q) ||
      w.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const handleSuggestSubmit = async (payload: {
    name: string;
    phone: string;
    location: string;
    serviceType: string;
    reason: string;
  }) => {
    await dispatch(suggestCarWash(payload)).unwrap();
  };

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
              distanceKm: item.distance_km ?? 0,
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

      <TouchableOpacity
        style={[styles.fab, { bottom: tabBarClearance }]}
        onPress={() => setSuggestModalVisible(true)}
        activeOpacity={0.85}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <SuggestCarWashModal
        visible={suggestModalVisible}
        onClose={() => setSuggestModalVisible(false)}
        onSubmit={handleSuggestSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 70 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 8, gap: 12 },
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
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
