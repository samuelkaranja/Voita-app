import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
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
  HelpCircle,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchScoutDetail,
  clearDetail,
  ScoutSkill,
  ScoutReview,
} from '../../redux/slices/services/scoutsSlice';

import { ScoutProfileHero } from './components/scout-detail/ScoutProfileHero';
import { ScoutProfileSummary } from './components/scout-detail/ScoutProfileSummary';
import { ScoutBio } from './components/scout-detail/ScoutBio';
import { CertifiedSkillsSection } from './components/scout-detail/CertifiedSkillsSection';
import { ScoutReviewCard } from './components/scout-detail/ScoutReviewCard';
import { DetailBottomBar } from './components/mechanic-detail/DetailBottomBar';
import { SectionHeader } from './components/SectionHeader';

type ProfileRoute = RouteProp<ServicesStackParamList, 'ScoutProfile'>;

// Map icon strings from the API to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  car: Car,
  'heart-pulse': HeartPulse,
  map: Map,
  'hand-helping': HandHelping,
  lock: Lock,
  shield: ShieldCheck,
  'key-round': KeyRound,
};
const fallbackIcon: LucideIcon = HelpCircle;

// Tag icons — tags come back as plain strings from the API,
// so we derive a fallback icon based on common tag values
const TAG_ICON_MAP: Record<string, LucideIcon> = {
  'pro driver': ShieldCheck,
  'valet expert': KeyRound,
  'price auditor': Car,
  'mech consultant': Car,
};
const fallbackTagIcon: LucideIcon = ShieldCheck;

export default function ScoutProfileScreen() {
  const route = useRoute<ProfileRoute>();
  const { scoutId } = route.params;

  const dispatch = useAppDispatch();
  const { detail, detailLoading, detailError } = useAppSelector(s => s.scouts);

  useEffect(() => {
    dispatch(fetchScoutDetail(scoutId));
    return () => {
      dispatch(clearDetail());
    };
  }, [scoutId]);

  useEffect(() => {
    console.log('[ScoutProfile] scoutId:', scoutId);
    dispatch(fetchScoutDetail(scoutId));
    return () => {
      dispatch(clearDetail());
    };
  }, [scoutId]);

  if (detailLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color="#10B981" size="large" />
      </SafeAreaView>
    );
  }

  if (detailError || !detail) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>
          {detailError ?? 'Scout not found.'}
        </Text>
      </SafeAreaView>
    );
  }

  // Map API tags ({id, label}) → ScoutProfileSummary tag shape ({id, label, Icon})
  const summaryTags = detail.tags.map((tag, index) => ({
    id: String(index),
    label: tag,
    Icon: TAG_ICON_MAP[tag.toLowerCase()] ?? fallbackTagIcon,
  }));

  // Map API skills → CertifiedSkillsSection shape
  const skills = detail.skills.map((sk: ScoutSkill) => ({
    id: String(sk.id),
    label: sk.label,
    subtitle: sk.subtitle,
    Icon: ICON_MAP[sk.icon] ?? fallbackIcon,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScoutProfileHero
          imageUri={detail.avatar_url ?? ''}
          isVerified={detail.is_verified}
          onShare={() => {}}
        />

        <View style={styles.body}>
          <ScoutProfileSummary
            name={detail.name}
            location={detail.location}
            rating={detail.rating}
            missions={detail.missions_completed}
            tags={summaryTags}
          />

          {detail.bio ? <ScoutBio text={detail.bio} /> : null}

          {skills.length > 0 && <CertifiedSkillsSection skills={skills} />}

          {detail.reviews.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Recent Reviews" />
              {detail.reviews.map((r: ScoutReview) => (
                <ScoutReviewCard
                  key={r.id}
                  item={{
                    id: String(r.id),
                    avatarUri: r.avatar_url ?? '',
                    name: r.name,
                    timeAgo: '', // API returns no timeAgo — omit or derive from a date field if added later
                    rating: r.rating,
                    quote: r.comment,
                  }}
                />
              ))}
            </View>
          )}
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
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 100 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  section: { gap: 12 },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
