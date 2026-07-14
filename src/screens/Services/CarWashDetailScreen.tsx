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
import { Sparkles, Car, Layers, Gem, HelpCircle } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

import type { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchCarWashDetail,
  clearDetail,
  CarWashService,
} from '../../redux/slices/services/carWashSlice';

import { CarWashDetailHero } from './components/carwash-detail/CarWashDetailHero';
import { CarWashAbout } from './components/carwash-detail/CarWashAbout';
import { CarWashServiceCard } from './components/carwash-detail/CarWashServiceCard';
import { ReviewCard } from './components/mechanic-detail/ReviewCard';
import { CarWashDetailBottomBar } from './components/carwash-detail/CarWashDetailBottomBar';
import { SectionHeader } from './components/SectionHeader';

type DetailRoute = RouteProp<ServicesStackParamList, 'CarWashDetail'>;

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  car: Car,
  layers: Layers,
  gem: Gem,
};
const fallbackIcon: LucideIcon = HelpCircle;

export default function CarWashDetailScreen() {
  const route = useRoute<DetailRoute>();
  const { carWashId } = route.params;

  const dispatch = useAppDispatch();
  const { detail, detailLoading, detailError } = useAppSelector(s => s.carwash);

  useEffect(() => {
    dispatch(fetchCarWashDetail(carWashId));
    return () => {
      dispatch(clearDetail());
    };
  }, [carWashId]);

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
          {detailError ?? 'Car wash not found.'}
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
        <CarWashDetailHero
          imageUri={detail.image_url}
          name={detail.name}
          rating={detail.rating}
          reviewCount={detail.review_count}
          isVerifiedPartner={detail.verified}
          onShare={() => {}}
        />

        <View style={styles.body}>
          {/* About */}
          {detail.description ? (
            <CarWashAbout
              title={`About ${detail.name}`}
              segments={[{ text: detail.description }]}
            />
          ) : null}

          {/* Services */}
          {detail.services.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Services" />
              {detail.services.map((svc: CarWashService) => (
                <CarWashServiceCard
                  key={svc.id}
                  item={{
                    id: String(svc.id),
                    label: svc.label,
                    description: svc.description,
                    price: Number(String(svc.price).replace(/[^0-9.]/g, '')),
                    Icon: ICON_MAP[svc.icon] ?? fallbackIcon,
                    premium: svc.is_premium,
                  }}
                  onAddToBooking={() => {}}
                />
              ))}
            </View>
          )}

          {/* Reviews */}
          {detail.reviews.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Client Reviews" />
              {detail.reviews.map(r => (
                <ReviewCard
                  key={r.id}
                  item={{
                    id: String(r.id),
                    name: r.name,
                    initials: r.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2),
                    avatarColor: '#10B981',
                    daysAgo: 0,
                    rating: r.rating,
                    quote: r.comment,
                  }}
                />
              ))}
            </View>
          )}
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
  safe: { flex: 1, backgroundColor: '#F3F4F6', paddingBottom: 100 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 20 },
  section: { gap: 12 },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
