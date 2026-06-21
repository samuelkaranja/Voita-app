import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Star, ArrowRight, ClipboardList, Car } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

export type ScoutCTAType = 'book' | 'request' | 'schedule';

export interface ScoutItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  missionsCompleted?: number;
  avatarUri: string;
  tags: string[];
  bio: string;
  ctaType: ScoutCTAType;
  accentColor?: string;
}

const CTA_CONFIG: Record<ScoutCTAType, { label: string; Icon: LucideIcon }> = {
  book: { label: 'Book Scout', Icon: ArrowRight },
  request: { label: 'Quick Request', Icon: ClipboardList },
  schedule: { label: 'Schedule Valet', Icon: Car },
};

interface ScoutCardProps {
  item: ScoutItem;
  onPress: (id: string) => void;
}

export const ScoutCard: React.FC<ScoutCardProps> = ({ item, onPress }) => {
  const cta = CTA_CONFIG[item.ctaType];
  const accent = item.accentColor ?? '#10B981';

  return (
    <View style={[styles.container, { borderLeftColor: accent }]}>
      {/* Top: avatar + info + rating */}
      <View style={styles.topRow}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />

        <View style={styles.infoBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
              <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.role}>{item.role}</Text>

          {item.missionsCompleted !== undefined && (
            <Text style={styles.missions}>
              {item.missionsCompleted.toLocaleString()} Missions Completed
            </Text>
          )}

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsRow}
          >
            {item.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio} numberOfLines={2}>
        {item.bio}
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onPress(item.id)}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>{cta.label}</Text>
        <cta.Icon size={16} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 10,
  },
  infoBlock: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
  },
  role: {
    fontSize: 12,
    color: '#6B7280',
  },
  missions: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  tagsRow: {
    gap: 6,
    paddingTop: 4,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.4,
  },
  bio: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 13,
    gap: 8,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
