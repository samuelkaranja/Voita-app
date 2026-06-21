import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface CategoryItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  active?: boolean;
}

interface CategoryCardProps {
  item: CategoryItem;
  onPress: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  item,
  onPress,
}) => {
  const isActive = !!item.active;

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.containerActive]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <item.Icon
        size={22}
        color={isActive ? '#10B981' : '#374151'}
        strokeWidth={1.75}
      />

      <Text style={[styles.label, isActive && styles.labelActive]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  containerActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    // neutralize shadow entirely when active
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  label: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  labelActive: {
    color: '#10B981',
  },
});
