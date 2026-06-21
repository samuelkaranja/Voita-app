import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Truck, FileText } from 'lucide-react-native';

import { ScoutHeroBanner } from './components/scouts/ScoutHeroBanner';
import { ScoutCard, ScoutItem } from './components/scouts/ScoutCard';
import { OnlineIndicator } from './components/scouts/OnlineIndicator';
import { MissionItem, MissionEntry } from './components/scouts/MissionItem';
import { SectionHeader } from './components/SectionHeader';
import { MapFAB } from './components/MapFAB';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '../../navigation/ServicesStack';

// Data

const SCOUT_FILTERS = [
  { id: 'all', label: 'ALL SCOUTS' },
  { id: 'drivers', label: 'DRIVERS' },
  { id: 'auditors', label: 'AUDITOR' },
  { id: 'valet', label: 'VALET' },
];

const SCOUTS: ScoutItem[] = [
  {
    id: 'sc1',
    name: 'Marcus Vance',
    role: '1,240 Missions Completed',
    rating: 4.9,
    avatarUri:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    tags: ['PRO DRIVER', 'VALET EXPERT'],
    bio: 'Ex-police officer specialized in secure vehicle transport and long-distance scout driving....',
    ctaType: 'book',
  },
  {
    id: 'sc2',
    name: 'Elena Rodriguez',
    role: 'Expert Quote Auditor',
    rating: 5.0,
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    tags: ['PRICE AUDITOR', 'MECH CONSULTANT'],
    bio: 'Former service advisor with 15 years experience. I ensure you never pay for...',
    ctaType: 'request',
  },
  {
    id: 'sc3',
    name: 'Julian K.',
    role: 'Premium Valet Specialist',
    rating: 4.8,
    avatarUri:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    tags: ['VALET EXPERT', 'PRO DRIVER'],
    bio: 'Managing high-end vehicle logistics. GPS-tracked delivery and full detailed reports for...',
    ctaType: 'schedule',
  },
];

const MISSIONS: MissionEntry[] = [
  {
    id: 'm1',
    title: 'Valet with Julian K.',
    subtitle: 'BMW X5 Service',
    detail: 'In Transit',
    status: 'active',
    costOrStatus: 'ACTIVE NOW',
    Icon: Truck,
    iconBgColor: '#ECFDF5',
    iconColor: '#10B981',
  },
  {
    id: 'm2',
    title: 'Audit by Elena R.',
    subtitle: 'Brake System Review',
    detail: 'Completed Oct 08',
    status: 'completed',
    costOrStatus: '-$120',
    Icon: FileText,
    iconBgColor: '#EFF6FF',
    iconColor: '#3B82F6',
  },
];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ScoutsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredScouts = SCOUTS.filter(s => {
    const matchesSearch =
      search.trim() === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      activeFilter === 'all' ||
      s.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>
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
            <OnlineIndicator label="Verified Scouts Available Now" count={24} />
          </View>
        }
        renderItem={({ item }) => (
          <ScoutCard
            item={item}
            onPress={id => navigation.navigate('ScoutProfile', { scoutId: id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <SectionHeader
              title="Your Recent Missions"
              actionLabel="Full History ›"
              onAction={() => {}}
            />
            <View style={styles.missionsCard}>
              {MISSIONS.map((m, i) => (
                <View key={m.id}>
                  <MissionItem item={m} />
                  {i < MISSIONS.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
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
    gap: 16,
  },
  footer: {
    paddingTop: 20,
    gap: 12,
    paddingBottom: 60,
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
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});
