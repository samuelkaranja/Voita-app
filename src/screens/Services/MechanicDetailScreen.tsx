import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cpu, Wrench, Disc, Droplets } from 'lucide-react-native';

import { DetailHero } from './components/mechanic-detail/DetailHero';
import { DetailSummary } from './components/mechanic-detail/DetailSummary';
import { AboutSection } from './components/mechanic-detail/AboutSection';
import {
  ServiceItem,
  ServiceEntry,
} from './components/mechanic-detail/ServiceItem';
import {
  ReviewCard,
  ReviewEntry,
} from './components/mechanic-detail/ReviewCard';
import { InsurancePartners } from './components/mechanic-detail/InsurancePartners';
import { MapPreview } from './components/mechanic-detail/MapPreview';
import { DetailBottomBar } from './components/mechanic-detail/DetailBottomBar';
import { SectionHeader } from './components/SectionHeader';

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { ServicesStackParamList } from '../../navigation/ServicesStack';

type DetailRoute = RouteProp<ServicesStackParamList, 'MechanicDetail'>;

// ── Static data (replace with route.params / API call) ────────────────────────

const SERVICES: ServiceEntry[] = [
  {
    id: 's1',
    label: 'Full Diagnostics',
    description: 'Comprehensive scanning of all electronic control units.',
    Icon: Cpu,
    highlighted: true,
  },
  {
    id: 's2',
    label: 'Engine Overhaul',
    description: 'Complete restoration and performance re-calibration.',
    Icon: Wrench,
  },
  {
    id: 's3',
    label: 'Brake Service',
    description: 'OEM performance pad and disc replacement.',
    Icon: Disc,
  },
  {
    id: 's4',
    label: 'Oil Change',
    description: 'High-grade synthetic fluids with genuine filters.',
    Icon: Droplets,
  },
];

const REVIEWS: ReviewEntry[] = [
  {
    id: 'r1',
    initials: 'MK',
    avatarColor: '#6366F1',
    name: 'Marcus K.',
    daysAgo: 2,
    rating: 5,
    quote:
      'The precision tuning they did on my M4 is incredible. Feels like a different car. Highly professional environment.',
  },
];

// Screen

export default function MechanicDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { mechanicId } = route.params;
  const [favourited, setFavourited] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DetailHero
          imageUri="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
          verified
          isFavourited={favourited}
          onShare={() => {}}
          onFavourite={() => setFavourited(f => !f)}
        />

        <View style={styles.body}>
          <DetailSummary
            name="Elite Precision Motors"
            rating={4.9}
            reviewCount={1200}
            address="1.2 miles away • 456 Tech Drive, Sector 7"
            availability="Open Now"
            specialty="Engine Tuning"
          />

          <AboutSection text="At Elite Precision Motors, we specialise in high-performance maintenance for premium vehicles. With a focus on BMW diagnostics and bespoke engine tuning, our master technicians utilise factory-grade tools to ensure your machine operates at its peak potential. We bridge the gap between technical mastery and urban convenience." />

          {/* Specialised Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialized Services</Text>
            {SERVICES.map(svc => (
              <ServiceItem key={svc.id} item={svc} />
            ))}
          </View>

          {/* Client Reviews */}
          <View style={styles.section}>
            <SectionHeader
              title="Client Reviews"
              actionLabel="SEE ALL"
              onAction={() => {}}
            />
            {REVIEWS.map(r => (
              <ReviewCard key={r.id} item={r} />
            ))}
          </View>

          <InsurancePartners />

          <MapPreview onGetDirections={() => {}} />
        </View>
      </ScrollView>

      <DetailBottomBar
        onCall={() => {}}
        onMessage={() => {}}
        onBookAppointment={() => {}}
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
