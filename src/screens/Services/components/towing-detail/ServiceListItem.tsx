import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface ServiceListEntry {
  id: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  accent?: boolean; // green bottom border variant
}

interface ServiceListItemProps {
  item: ServiceListEntry;
}

export const ServiceListItem: React.FC<ServiceListItemProps> = ({ item }) => {
  return (
    <View style={[styles.container, item.accent && styles.containerAccent]}>
      <item.Icon size={24} color="#374151" strokeWidth={1.75} />
      <View style={styles.text}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  containerAccent: {
    borderBottomColor: '#10B981',
  },
  text: {
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
