import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Sparkles, Car, Layers, Gem } from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { CarWashDetailHero } from './components/carwash-detail/CarWashDetailHero';
import { CarWashAbout } from './components/carwash-detail/CarWashAbout';
import { LoyaltyPassBanner } from './components/carwash-detail/LoyaltyPassBanner';
import {
  CarWashServiceCard,
  CarWashServiceEntry,
} from './components/carwash-detail/CarWashServiceCard';
import {
  ReviewCard,
  ReviewEntry,
} from './components/mechanic-detail/ReviewCard';
import { CarWashDetailBottomBar } from './components/carwash-detail/CarWashDetailBottomBar';
import { SectionHeader } from './components/SectionHeader';

type DetailRoute = RouteProp<ServicesStackParamList, 'CarWashDetail'>;

// Static data (replace with route.params / API)

const SERVICES: CarWashServiceEntry[] = [
  {
    id: 'cs1',
    label: 'Full Detail',
    description: 'Interior deep clean, exterior wax, and engine bay wipe down.',
    price: 45,
    Icon: Sparkles,
  },
  {
    id: 'cs2',
    label: 'Exterior Wash',
    description: 'Quick touchless wash with air drying and tire shine.',
    price: 15,
    Icon: Car,
  },
  {
    id: 'cs3',
    label: 'Interior Pro',
    description: 'Deep vacuum, steam clean, and dash conditioning.',
    price: 30,
    Icon: Layers,
  },
  {
    id: 'cs4',
    label: 'Ceramic Coating',
    description: 'Nano-technology protection with 6-month durability.',
    price: 120,
    Icon: Gem,
    premium: true,
  },
];

const REVIEWS: ReviewEntry[] = [
  {
    id: 'rv1',
    initials: 'JS',
    avatarColor: '#10B981',
    name: 'James Sterling',
    daysAgo: 2,
    rating: 5,
    quote:
      'The ceramic coating they applied is unbelievable. Water just beads off, and the finish looks better than the day I bought it from the dealer.',
  },
];

// Screen

export default function CarWashDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { carWashId } = route.params;
  // Use carWashId to fetch from Redux / API as needed

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CarWashDetailHero
          imageUri="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80"
          name="Pristine Auto Spa"
          rating={4.8}
          reviewCount={1200}
          waitMins={5}
          isVerifiedPartner
          onShare={() => {}}
        />

        <View style={styles.body}>
          <CarWashAbout
            title="About Pristine Auto Spa"
            segments={[
              {
                text: 'Experience automotive excellence at its finest. We utilize premium, ',
              },
              { text: 'eco-friendly products', highlighted: true },
              {
                text: ' and state-of-the-art water reclamation systems to ensure your vehicle shines while respecting the environment. Our certified technicians treat every car like a masterpiece.',
              },
            ]}
          />

          <LoyaltyPassBanner
            title="Weekly Loyalty Pass"
            subtitle="Get unlimited exterior washes and 2 interior pros."
            savingsLabel="Save 40%"
            onPress={() => {}}
          />

          {/* Services */}
          <View style={styles.section}>
            <SectionHeader
              title="Services"
              actionLabel="VIEW ALL"
              onAction={() => {}}
            />
            {SERVICES.map(svc => (
              <CarWashServiceCard
                key={svc.id}
                item={svc}
                onAddToBooking={id => {}}
              />
            ))}
          </View>

          {/* Client Reviews */}
          <View style={styles.section}>
            <SectionHeader title="Client Reviews" />
            {REVIEWS.map(r => (
              <ReviewCard key={r.id} item={r} />
            ))}
          </View>
        </View>
      </ScrollView>

      <CarWashDetailBottomBar
        onDirections={() => {}}
        onBookService={() => {}}
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
    paddingTop: 16,
    gap: 20,
  },
  section: {
    gap: 12,
  },
});
