import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

export interface ScoutReviewEntry {
  id: string;
  avatarUri: string;
  name: string;
  timeAgo: string;
  rating: number;
  quote: string;
}

interface ScoutReviewCardProps {
  item: ScoutReviewEntry;
}

export const ScoutReviewCard: React.FC<ScoutReviewCardProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                color="#F59E0B"
                fill={i < item.rating ? '#F59E0B' : 'transparent'}
                strokeWidth={1.5}
              />
            ))}
          </View>
        </View>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>

      {/* Quote */}
      <Text style={styles.quote}>"{item.quote}"</Text>
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
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingTop: 2,
  },
  quote: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
