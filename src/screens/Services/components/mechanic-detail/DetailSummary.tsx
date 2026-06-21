import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';

interface DetailSummaryProps {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  availability: 'Open Now' | 'Closed' | 'By Appointment';
  specialty: string;
}

export const DetailSummary: React.FC<DetailSummaryProps> = ({
  name,
  rating,
  reviewCount,
  address,
  availability,
  specialty,
}) => {
  const isOpen = availability === 'Open Now';

  return (
    <View style={styles.container}>
      {/* Name + Rating */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.ratingBlock}>
          <View style={styles.ratingRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>
            {reviewCount >= 1000
              ? `${(reviewCount / 1000).toFixed(1)}k`
              : reviewCount}{' '}
            reviews
          </Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressRow}>
        <MapPin size={13} color="#9CA3AF" strokeWidth={2} />
        <Text style={styles.address}>{address}</Text>
      </View>

      {/* Pills */}
      <View style={styles.pillsRow}>
        <View style={styles.pillBlock}>
          <Text style={styles.pillLabel}>AVAILABILITY</Text>
          <Text
            style={[styles.pillValue, isOpen ? styles.open : styles.closed]}
          >
            {availability}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.pillBlock}>
          <Text style={styles.pillLabel}>SPECIALTY</Text>
          <Text style={styles.pillValue}>{specialty}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    lineHeight: 26,
  },
  ratingBlock: {
    alignItems: 'flex-end',
    gap: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  address: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    gap: 16,
  },
  pillBlock: {
    gap: 3,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  pillValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  open: {
    color: '#10B981',
  },
  closed: {
    color: '#EF4444',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#F3F4F6',
  },
});
