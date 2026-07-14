import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Star, MapPin, Clock, ShieldCheck } from 'lucide-react-native';

export interface CarWashItem {
  id: string;
  name: string;
  rating: number;
  distanceKm: number;
  area: string;
  imageUri: string;
  waitMins: number;
  verified?: boolean;
  tags: { label: string; highlighted?: boolean }[];
}

interface CarWashCardProps {
  item: CarWashItem;
  onPress: (id: string) => void;
  onBookService: (id: string) => void;
}

export const CarWashCard: React.FC<CarWashCardProps> = ({
  item,
  onPress,
  onBookService,
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

        {/* <View style={styles.waitBadge}>
          <Clock size={12} color="#374151" strokeWidth={2} />
          <Text style={styles.waitText}>Wait: {item.waitMins} mins</Text>
        </View> */}
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Name + Rating/Price */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingBlock}>
            <View style={styles.ratingRow}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MapPin size={12} color="#9CA3AF" strokeWidth={2} />
          <Text style={styles.locationText}>
            {item.distanceKm} km • {item.area}
          </Text>
        </View>

        {/* Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsRow}
        >
          {item.tags.map(tag => (
            <View
              key={tag.label}
              style={[styles.tag, tag.highlighted && styles.tagHighlighted]}
            >
              <Text
                style={[
                  styles.tagText,
                  tag.highlighted && styles.tagTextHighlighted,
                ]}
              >
                {tag.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* CTA */}
        {/* <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onBookService(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Book Service</Text>
        </TouchableOpacity> */}
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
    marginVertical: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 195,
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
  waitBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  waitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  body: {
    padding: 14,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  ratingBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  priceTier: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
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
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagHighlighted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tagTextHighlighted: {
    color: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 2,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
