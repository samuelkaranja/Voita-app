import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';
import {
  fetchScouts,
  fetchUserMissions,
  clearErrors,
} from '../../redux/slices/services/scoutsSlice';

import { ScreenHeader } from './components/ScreenHeader';
import { ScoutHeroBanner } from './components/scouts/ScoutHeroBanner';
import { ScoutCard } from './components/scouts/ScoutCard';
import { OnlineIndicator } from './components/scouts/OnlineIndicator';
import { MissionItem } from './components/scouts/MissionItem';
import { SectionHeader } from './components/SectionHeader';
import { MapFAB } from './components/MapFAB';
import { Truck, FileText } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const SCOUT_FILTERS = [
  { id: 'all', label: 'ALL SCOUTS' },
  { id: 'drivers', label: 'DRIVERS' },
  { id: 'auditors', label: 'AUDITOR' },
  { id: 'valet', label: 'VALET' },
];

// Map icon strings from missions API to Lucide components
const MISSION_ICON_MAP: Record<string, any> = {
  truck: Truck,
  'file-text': FileText,
  default: Truck,
};

export default function ScoutsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const dispatch = useAppDispatch();

  const { list, missions, listLoading, missionsLoading, listError } =
    useAppSelector(s => s.scouts);
  const token = useAppSelector(s => s.auth?.token);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchScouts({ category: activeFilter }));
    if (token) dispatch(fetchUserMissions(token));
    return () => {
      dispatch(clearErrors());
    };
  }, [activeFilter]);

  // Client-side search on top of API
  const filteredScouts = list.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Scouts" />
      <FlatList
        data={filteredScouts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScoutHeroBanner
              search={search}
              onSearchChange={setSearch}
              filters={SCOUT_FILTERS}
              activeFilter={activeFilter}
              onFilterPress={setActiveFilter}
            />
            <OnlineIndicator
              label="Verified Scouts Available Now"
              count={filteredScouts.length}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ScoutCard
            item={{
              id: item.id,
              name: item.name,
              role: item.role,
              rating: item.rating,
              missionsCompleted: item.missions_completed,
              avatarUri: item.avatar_url ?? '',
              tags: item.tags,
              bio: item.bio,
              ctaType: item.cta_type,
              accentColor: item.accent_color ?? '#10B981',
            }}
            onPress={id => navigation.navigate('ScoutProfile', { scoutId: id })}
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
            <Text style={styles.emptyText}>No scouts found.</Text>
          )
        }
        ListFooterComponent={
          missions.length > 0 ? (
            <View style={styles.footer}>
              <SectionHeader title="Your Recent Missions" />
              <View style={styles.missionsCard}>
                {missions.map((m, i) => (
                  <View key={m.id}>
                    <MissionItem
                      item={{
                        id: m.id,
                        title: m.title,
                        subtitle: m.subtitle,
                        detail: m.detail,
                        status: m.status,
                        costOrStatus: m.cost_or_status,
                        Icon:
                          MISSION_ICON_MAP[m.icon] ?? MISSION_ICON_MAP.default,
                        iconBgColor: m.icon_bg_color,
                        iconColor: m.icon_color,
                      }}
                    />
                    {i < missions.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </View>
          ) : null
        }
      />
      <MapFAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 70 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 8, gap: 16 },
  footer: { paddingTop: 20, gap: 12, paddingBottom: 60 },
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
  missionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
});
