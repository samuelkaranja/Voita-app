import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

export interface ReviewEntry {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  daysAgo: number;
  rating: number;
  quote: string;
}

interface ReviewCardProps {
  item: ReviewEntry;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.initials}>{item.initials}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                color="#F59E0B"
                fill={i < item.rating ? '#F59E0B' : 'transparent'}
                strokeWidth={1.5}
              />
            ))}
          </View>
        </View>
        <Text style={styles.date}>{item.daysAgo} days ago</Text>
      </View>
      <Text style={styles.quote}>"{item.quote}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameBlock: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  date: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  quote: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
