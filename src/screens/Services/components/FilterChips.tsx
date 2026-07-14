import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronDown, CheckCircle } from 'lucide-react-native';

export interface FilterChip {
  id: string;
  label: string;
  hasDropdown?: boolean;
  hasIcon?: boolean;
  active?: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onFilterPress: (id: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onFilterPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={[styles.chip, filter.active && styles.chipActive]}
          onPress={() => onFilterPress(filter.id)}
          activeOpacity={0.75}
        >
          <Text style={[styles.label, filter.active && styles.labelActive]}>
            {filter.label}
          </Text>
          {filter.hasDropdown && (
            <ChevronDown
              size={14}
              color={filter.active ? '#FFFFFF' : '#374151'}
              strokeWidth={2.5}
            />
          )}
          {filter.hasIcon && (
            <CheckCircle
              size={14}
              color={filter.active ? '#FFFFFF' : '#10B981'}
              strokeWidth={2}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
