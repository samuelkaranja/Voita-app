import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Star,
  MapPin,
  Phone,
  CheckCircle,
  Truck,
  GalleryHorizontalEnd,
  Bus,
} from 'lucide-react-native';

export type TowingAvailability = 'available' | 'busy';

export interface TowingItem {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  etaMin: number;
  etaMax: number;
  tags: string[];
  availability: TowingAvailability;
  isPartner?: boolean;
  vehicleType: 'flatbed' | 'heavy' | 'roadside';
}

interface TowingCardProps {
  item: TowingItem;
  onDetails: (id: string) => void;
  onCall: (id: string) => void;
}

const VEHICLE_ICONS = {
  flatbed: Truck,
  heavy: GalleryHorizontalEnd,
  roadside: Bus,
};

export const TowingCard: React.FC<TowingCardProps> = ({
  item,
  onDetails,
  onCall,
}) => {
  const isBusy = item.availability === 'busy';
  const VehicleIcon = VEHICLE_ICONS[item.vehicleType];

  return (
    <View style={styles.container}>
      {/* Top row: icon + name/badge/ETA */}
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <VehicleIcon size={28} color="#374151" strokeWidth={1.75} />
        </View>

        <View style={styles.nameBlock}>
          <View style={styles.nameBadgeRow}>
            <Text style={styles.name}>{item.name}</Text>
            {item.isPartner && (
              <View style={styles.partnerBadge}>
                <CheckCircle size={11} color="#10B981" strokeWidth={2.5} />
                <Text style={styles.partnerText}>PARTNER</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.metaText}>
              {item.rating.toFixed(1)} (
              {item.reviewCount >= 1000
                ? `${(item.reviewCount / 1000).toFixed(1)}k`
                : item.reviewCount}
              )
            </Text>
            <Text style={styles.dot}>•</Text>
            <MapPin size={12} color="#6B7280" strokeWidth={2} />
            <Text style={styles.metaText}>{item.distanceKm} km</Text>
          </View>
        </View>

        {/* ETA */}
        <View style={styles.etaBlock}>
          <Text style={[styles.etaValue, isBusy && styles.etaBusy]}>
            {item.etaMin}-{item.etaMax}
          </Text>
          <Text style={styles.etaUnit}>mins</Text>
        </View>
      </View>

      {/* Tags + availability */}
      <View style={styles.tagsRow}>
        {item.tags.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <View style={styles.availabilityBlock}>
          {!isBusy && <View style={styles.availableDot} />}
          <Text style={[styles.availabilityText, isBusy && styles.busyText]}>
            {isBusy ? 'BUSY NOW' : 'AVAILABLE 24/7'}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => onDetails(item.id)}
          activeOpacity={0.75}
        >
          <Text style={styles.detailsText}>Details</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.callButton, isBusy && styles.callButtonBusy]}
          onPress={() => onCall(item.id)}
          activeOpacity={0.8}
        >
          <Phone size={15} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
          <Text style={styles.callText}>Call Now</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  partnerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dot: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  etaBlock: {
    alignItems: 'flex-end',
  },
  etaValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
    lineHeight: 24,
  },
  etaBusy: {
    color: '#EF4444',
  },
  etaUnit: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  availabilityBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 'auto',
  },
  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 0.4,
  },
  busyText: {
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  callButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 9,
    paddingVertical: 12,
    gap: 7,
  },
  callButtonBusy: {
    backgroundColor: '#6B7280',
  },
  callText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
