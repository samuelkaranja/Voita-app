import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface ServiceIconEntry {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface ServiceIconItemProps {
  item: ServiceIconEntry;
}

export const ServiceIconItem: React.FC<ServiceIconItemProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <item.Icon size={26} color="#374151" strokeWidth={1.75} />
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
});
