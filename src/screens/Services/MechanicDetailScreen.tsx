import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Cpu, Wrench, Disc, Droplets, HelpCircle } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
//import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchMechanicDetail,
  clearDetail,
  MechanicService,
} from '../../redux/slices/services//mechanicsSlice';

import { DetailHero } from './components/mechanic-detail/DetailHero';
import { DetailSummary } from './components/mechanic-detail/DetailSummary';
import { AboutSection } from './components/mechanic-detail/AboutSection';
import { ServiceItem } from './components/mechanic-detail/ServiceItem';
import { InsurancePartners } from './components/mechanic-detail/InsurancePartners';
import { DetailBottomBar } from './components/mechanic-detail/DetailBottomBar';
import { SectionHeader } from './components/SectionHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type DetailRoute = RouteProp<ServicesStackParamList, 'MechanicDetail'>;

// Map icon_key strings from the API to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  wrench: Wrench,
  disc: Disc,
  droplets: Droplets,
};
const fallbackIcon: LucideIcon = HelpCircle;

export default function MechanicDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { mechanicId } = route.params;

  const dispatch = useAppDispatch();
  const { detail, detailLoading, detailError } = useAppSelector(
    s => s.mechanics,
  );
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    dispatch(fetchMechanicDetail(mechanicId));
    return () => {
      dispatch(clearDetail());
    };
  }, [mechanicId]);

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
          {detailError ?? 'Mechanic not found.'}
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
        <DetailHero
          imageUri={detail.image_url}
          verified={detail.verified}
          isFavourited={favourited}
          onShare={() => {}}
          onFavourite={() => setFavourited(f => !f)}
        />

        <View style={styles.body}>
          <DetailSummary
            name={detail.name}
            rating={detail.rating}
            reviewCount={detail.review_count}
            address={detail.address}
            availability={detail.availability ? 'Open Now' : 'Closed'}
            specialty={detail.specialties?.[0] ?? 'General'}
          />

          {detail.description ? (
            <AboutSection text={detail.description} />
          ) : null}

          {detail.services.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specialized Services</Text>
              {detail.services.map(
                (svc: {
                  id: React.Key | null | undefined;
                  label: any;
                  description: any;
                  icon: string | number;
                  highlighted: any;
                }) => (
                  <ServiceItem
                    key={svc.id}
                    item={{
                      id: String(svc.id),
                      label: svc.label,
                      description: svc.description,
                      Icon: ICON_MAP[svc.icon] ?? fallbackIcon,
                      highlighted: svc.highlighted,
                    }}
                  />
                ),
              )}
            </View>
          )}

          {detail.insurance_partners.length > 0 && (
            <InsurancePartners partners={detail.insurance_partners} />
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
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 70 },
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
