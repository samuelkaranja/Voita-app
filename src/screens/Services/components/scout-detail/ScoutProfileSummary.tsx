import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Star, ShieldCheck, KeyRound } from 'lucide-react-native';

export interface ScoutTag {
  id: string;
  label: string;
  Icon: React.ComponentType<any>;
}

interface ScoutProfileSummaryProps {
  name: string;
  location: string;
  rating: number;
  missions: number;
  tags: ScoutTag[];
}

export const ScoutProfileSummary: React.FC<ScoutProfileSummaryProps> = ({
  name,
  location,
  rating,
  missions,
  tags,
}) => {
  return (
    <View style={styles.container}>
      {/* Name + Location */}
      <View style={styles.nameBlock}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.locationRow}>
          <MapPin size={13} color="#9CA3AF" strokeWidth={2} />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
            <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
          </View>
          <Text style={styles.statLabel}>RATING</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>
            {missions >= 1000
              ? `${(missions / 1000).toFixed(1)}k`
              : missions.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>MISSIONS</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {tags.map(tag => (
          <View key={tag.id} style={styles.tag}>
            <tag.Icon size={13} color="#374151" strokeWidth={2} />
            <Text style={styles.tagText}>{tag.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nameBlock: {
    gap: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
