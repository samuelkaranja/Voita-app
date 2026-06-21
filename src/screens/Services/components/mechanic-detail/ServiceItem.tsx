import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface ServiceEntry {
  id: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  highlighted?: boolean;
}

interface ServiceItemProps {
  item: ServiceEntry;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({ item }) => {
  const hl = item.highlighted;

  return (
    <View style={[styles.container, hl && styles.containerHighlighted]}>
      <View style={[styles.iconBox, hl && styles.iconBoxHighlighted]}>
        <item.Icon
          size={22}
          color={hl ? '#10B981' : '#374151'}
          strokeWidth={1.75}
        />
      </View>
      <View style={styles.text}>
        <Text style={[styles.label, hl && styles.labelHighlighted]}>
          {item.label}
        </Text>
        <Text style={[styles.description, hl && styles.descriptionHighlighted]}>
          {item.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  containerHighlighted: {
    backgroundColor: '#111827',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxHighlighted: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  labelHighlighted: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  descriptionHighlighted: {
    color: '#9CA3AF',
  },
});
