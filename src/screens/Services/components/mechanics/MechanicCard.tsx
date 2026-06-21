import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MapPin, Star, ShieldCheck } from 'lucide-react-native';

export interface MechanicItem {
  id: string;
  name: string;
  rating: number;
  distanceMiles: number;
  imageUri: string;
  verified?: boolean;
  availableToday?: boolean;
  specialties: string[];
}

interface MechanicCardProps {
  item: MechanicItem;
  onPress: (id: string) => void;
  onBookAppointment: (id: string) => void;
}

export const MechanicCard: React.FC<MechanicCardProps> = ({
  item,
  onPress,
  onBookAppointment,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id)}
      activeOpacity={0.92}
    >
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {item.verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={11} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}

        {item.availableToday && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available Today</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Name + Rating */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingRow}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.distanceRow}>
          <MapPin size={12} color="#9CA3AF" strokeWidth={2} />
          <Text style={styles.distance}>{item.distanceMiles} miles away</Text>
        </View>

        {/* Specialty Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsRow}
        >
          {item.specialties.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>

        {/* CTA */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onBookAppointment(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    width: '100%',
    height: 190,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  availableBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    padding: 14,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tagsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
