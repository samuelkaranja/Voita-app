import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ServiceCategory } from '../../../redux/slices/services/exploreSlice';

const BADGE_CONFIG: Record<
  ServiceCategory,
  { label: string; color: string; bg: string }
> = {
  mechanic: { label: 'Mechanic', color: '#3B82F6', bg: '#EFF6FF' },
  carwash: { label: 'Car Wash', color: '#10B981', bg: '#ECFDF5' },
  towing: { label: 'Towing', color: '#F59E0B', bg: '#FFFBEB' },
  scout: { label: 'Scout', color: '#8B5CF6', bg: '#F5F3FF' },
};

interface CategoryBadgeProps {
  category: ServiceCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const { label, color, bg } = BADGE_CONFIG[category];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
