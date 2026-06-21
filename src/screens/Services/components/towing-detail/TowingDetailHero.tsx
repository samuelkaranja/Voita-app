import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { ArrowLeft, Star, Clock, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface TowingDetailHeroProps {
  imageUri: string;
  name: string;
  rating: number;
  reviewCount: number;
  etaMin: number;
  etaMax: number;
  isAvailable: boolean;
  isVerifiedPartner: boolean;
}

export const TowingDetailHero: React.FC<TowingDetailHeroProps> = ({
  imageUri,
  name,
  rating,
  reviewCount,
  etaMin,
  etaMax,
  isAvailable,
  isVerifiedPartner,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Content pinned to bottom */}
      <View style={styles.content}>
        {/* Availability pill */}
        {isAvailable && (
          <View style={styles.availabilityPill}>
            <View style={styles.availabilityDot} />
            <Text style={styles.availabilityText}>AVAILABLE 24/7</Text>
          </View>
        )}

        <Text style={styles.name}>{name}</Text>

        {/* Rating + ETA row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.metaText}>
              {rating.toFixed(1)} (
              {reviewCount >= 1000
                ? `${(reviewCount / 1000).toFixed(1)}k`
                : reviewCount}{' '}
              reviews)
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.metaText}>
              {etaMin}–{etaMax} min
            </Text>
          </View>
        </View>

        {/* Verified partner badge */}
        {isVerifiedPartner && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={13} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.verifiedText}>Verified Partner</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 8,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  availabilityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
