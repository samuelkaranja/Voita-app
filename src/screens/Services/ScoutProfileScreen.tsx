import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Car,
  HeartPulse,
  Map,
  HandHelping,
  Lock,
  ShieldCheck,
  KeyRound,
} from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { ScoutProfileHero } from './components/scout-detail/ScoutProfileHero';
import { ScoutProfileSummary } from './components/scout-detail/ScoutProfileSummary';
import { ScoutBio } from './components/scout-detail/ScoutBio';
import { CertifiedSkillsSection } from './components/scout-detail/CertifiedSkillsSection';
import { SkillEntry } from './components/scout-detail/SkillCard';
import {
  ScoutReviewCard,
  ScoutReviewEntry,
} from './components/scout-detail/ScoutReviewCard';
import { DetailBottomBar } from './components/mechanic-detail/DetailBottomBar';
import { SectionHeader } from './components/SectionHeader';

type ProfileRoute = RouteProp<ServicesStackParamList, 'ScoutProfile'>;

// ── Static data (replace with route.params / API) ─────────────────────────────

const SKILLS: SkillEntry[] = [
  {
    id: 'sk1',
    label: 'Defensive Driving',
    subtitle: 'Level 5 Expert',
    Icon: Car,
  },
  {
    id: 'sk2',
    label: 'Advanced First Aid',
    subtitle: 'Red Cross Certified',
    Icon: HeartPulse,
  },
  {
    id: 'sk3',
    label: 'Route Analysis',
    subtitle: 'Real-time Optimization',
    Icon: Map,
  },
  {
    id: 'sk4',
    label: 'Concierge Care',
    subtitle: 'Premium Standards',
    Icon: HandHelping,
  },
  {
    id: 'sk5',
    label: 'Secure Custody',
    subtitle:
      'Certified for high-value asset transit and luxury vehicle handling.',
    Icon: Lock,
  },
];

const REVIEWS: ScoutReviewEntry[] = [
  {
    id: 'rv1',
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    name: 'Sarah Jenkins',
    timeAgo: '2 days ago',
    rating: 5,
    quote:
      'Marcus was incredibly professional. His background in law enforcement is evident in how he handled the scouting and parking in a very busy downtown area. I felt completely safe and the car was returned in perfect condition.',
  },
  {
    id: 'rv2',
    avatarUri:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    name: 'David Chen',
    timeAgo: '1 week ago',
    rating: 5,
    quote:
      "Top-tier service. He arrived early and communicated clearly throughout the entire mission. Best Scout I've used on Voita so far.",
  },
];

const TAGS = [
  { id: 't1', label: 'Pro Driver', Icon: ShieldCheck },
  { id: 't2', label: 'Valet Expert', Icon: KeyRound },
];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ScoutProfileScreen() {
  const route = useRoute<ProfileRoute>();
  const { scoutId } = route.params;
  // Use scoutId to fetch from Redux / API as needed

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScoutProfileHero
          imageUri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
          isVerified
          onShare={() => {}}
        />

        <View style={styles.body}>
          <ScoutProfileSummary
            name="Marcus Vance"
            location="Chicago, Illinois"
            rating={4.9}
            missions={1240}
            tags={TAGS}
          />

          <ScoutBio text="Ex-police officer with 15 years of experience in tactical transit and secure logistics. I specialize in high-stakes valet and scouting missions, prioritizing client safety and route efficiency above all. My approach is disciplined, punctual, and highly discreet." />

          <CertifiedSkillsSection skills={SKILLS} />

          {/* Reviews */}
          <View style={styles.section}>
            <SectionHeader
              title="Recent Reviews"
              actionLabel="View All"
              onAction={() => {}}
            />
            {REVIEWS.map(r => (
              <ScoutReviewCard key={r.id} item={r} />
            ))}
          </View>
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
    paddingTop: 16,
    gap: 16,
  },
  section: {
    gap: 12,
  },
});
