import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Truck,
  Wrench,
  Zap,
  Fuel,
  BatteryCharging,
  KeyRound,
} from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { TowingDetailHero } from './components/towing-detail/TowingDetailHero';
import { AboutSection } from './components/mechanic-detail/AboutSection';
import {
  ServiceListItem,
  ServiceListEntry,
} from './components/towing-detail/ServiceListItem';
import {
  ServiceIconItem,
  ServiceIconEntry,
} from './components/towing-detail/ServiceIconItem';
import { SafetyProtocolBanner } from './components/towing-detail/SafetyProtocolBanner';
import { LiveTruckMap } from './components/towing-detail/LiveTruckMap';
import { TowingDetailBottomBar } from './components/towing-detail/TowingDetailBottomBar';

type DetailRoute = RouteProp<ServicesStackParamList, 'TowingDetail'>;

// ── Static data (replace with route.params / API call) ────────────────────────

const DETAILED_SERVICES: ServiceListEntry[] = [
  {
    id: 'ds1',
    label: 'Flatbed Towing',
    description: 'Zero-contact transport for high-end & damaged vehicles.',
    Icon: Truck,
    accent: true,
  },
  {
    id: 'ds2',
    label: 'Tire Change',
    description: 'On-site replacement or inflation for all models.',
    Icon: Wrench,
    accent: true,
  },
];

const ICON_SERVICES: ServiceIconEntry[] = [
  { id: 'is1', label: 'Winching', Icon: Zap },
  { id: 'is2', label: 'Fuel', Icon: Fuel },
  { id: 'is3', label: 'Jump Start', Icon: BatteryCharging },
  { id: 'is4', label: 'Lockout', Icon: KeyRound },
];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function TowingDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { towingId } = route.params;
  // Use towingId to fetch from Redux / API as needed

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TowingDetailHero
          imageUri="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
          name="RapidTow Pro"
          rating={4.9}
          reviewCount={1200}
          etaMin={15}
          etaMax={20}
          isAvailable
          isVerifiedPartner
        />

        <View style={styles.body}>
          <AboutSection text="RapidTow Pro is your premier urgent-focus service provider. We specialize in immediate roadside intervention with a fleet of modern flatbeds and high-tech diagnostic equipment. Our operators are safety-certified and trained for high-stress urban environments, ensuring both you and your vehicle are handled with extreme precision." />

          {/* Our Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Services</Text>

            {/* Detailed service cards */}
            {DETAILED_SERVICES.map(svc => (
              <ServiceListItem key={svc.id} item={svc} />
            ))}

            {/* Icon-only service tiles */}
            {ICON_SERVICES.map(svc => (
              <ServiceIconItem key={svc.id} item={svc} />
            ))}
          </View>

          <SafetyProtocolBanner
            version="v2.4"
            description="Real-time tracking and verified identity protocols active."
          />

          <LiveTruckMap
            truckLabel="RAPIDTOW-04"
            driverName="Marcus Jensen"
            avgTimeMinutes={18}
            fleetSize="12+"
            isActive
            onLocate={() => {}}
          />
        </View>
      </ScrollView>

      <TowingDetailBottomBar
        onMessage={() => {}}
        onCall={() => {}}
        onShare={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});
