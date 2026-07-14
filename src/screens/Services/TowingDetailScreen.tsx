import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Truck,
  Wrench,
  Zap,
  Fuel,
  BatteryCharging,
  KeyRound,
  HelpCircle,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchTowingDetail,
  clearDetail,
  TowingService,
  TowingQuickService,
} from '../../redux/slices/services/towingSlice';

import { TowingDetailHero } from './components/towing-detail/TowingDetailHero';
import { AboutSection } from './components/mechanic-detail/AboutSection';
import { ServiceListItem } from './components/towing-detail/ServiceListItem';
import { ServiceIconItem } from './components/towing-detail/ServiceIconItem';
import { TowingDetailBottomBar } from './components/towing-detail/TowingDetailBottomBar';

type DetailRoute = RouteProp<ServicesStackParamList, 'TowingDetail'>;

const ICON_MAP: Record<string, LucideIcon> = {
  truck: Truck,
  wrench: Wrench,
  zap: Zap,
  fuel: Fuel,
  'battery-charging': BatteryCharging,
  'key-round': KeyRound,
};
const fallbackIcon: LucideIcon = HelpCircle;

export default function TowingDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { towingId } = route.params;

  const dispatch = useAppDispatch();
  const { detail, detailLoading, detailError } = useAppSelector(s => s.towing);

  useEffect(() => {
    dispatch(fetchTowingDetail(towingId));
    return () => {
      dispatch(clearDetail());
    };
  }, [towingId]);

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
          {detailError ?? 'Provider not found.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TowingDetailHero
          imageUri={detail.image_url}
          name={detail.name}
          rating={detail.rating}
          reviewCount={detail.review_count}
          etaMin={detail.eta_min}
          etaMax={detail.eta_max}
          isAvailable={detail.availability === 'available'}
          isVerifiedPartner={detail.verified}
        />

        <View style={styles.body}>
          {detail.description ? (
            <AboutSection text={detail.description} />
          ) : null}

          {/* Detailed services */}
          {detail.services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Services</Text>
              {detail.services.map((svc: TowingService) => (
                <ServiceListItem
                  key={svc.id}
                  item={{
                    id: String(svc.id),
                    label: svc.label,
                    description: svc.description,
                    Icon: ICON_MAP[svc.icon] ?? fallbackIcon,
                    accent: svc.is_highlighted,
                  }}
                />
              ))}

              {/* Quick/icon-only services */}
              {detail.quick_services.map((svc: TowingQuickService) => (
                <ServiceIconItem
                  key={svc.id}
                  item={{
                    id: String(svc.id),
                    label: svc.label,
                    Icon: ICON_MAP[svc.icon] ?? fallbackIcon,
                  }}
                />
              ))}
            </View>
          )}
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
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 100 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },
  body: { paddingHorizontal: 16, paddingTop: 14, gap: 14 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
