import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, CheckCircle } from 'lucide-react-native';
import { formatDistance } from '../../../utils/formatDistance';

export interface NearbyServiceItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distanceKm: number | null;
  imageUri: string;
  verified?: boolean;
}

interface NearbyServiceCardProps {
  item: NearbyServiceItem;
  onPress: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export const NearbyServiceCard: React.FC<NearbyServiceCardProps> = ({
  item,
  onPress,
  onViewDetails,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.verified && (
            <CheckCircle
              size={18}
              color="#ffffff"
              fill="#10B981"
              strokeWidth={3}
            />
          )}
        </View>
        <Text style={styles.category}>
          {item.category}
          {item.distanceKm != null
            ? ` • ${formatDistance(item.distanceKm)} away`
            : ''}
        </Text>
        <View style={styles.ratingRow}>
          <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({item.reviewCount} reviews)</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onViewDetails(item.id)}
          activeOpacity={0.75}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    flexShrink: 1,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailsButton: {
    marginTop: 4,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    textDecorationLine: 'underline',
  },
});
