import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface SkillEntry {
  id: string;
  label: string;
  subtitle: string;
  Icon: LucideIcon;
  fullWidth?: boolean;
}

interface SkillCardProps {
  item: SkillEntry;
}

export const SkillCard: React.FC<SkillCardProps> = ({ item }) => {
  return (
    <View
      style={[styles.container, item.fullWidth && styles.containerFullWidth]}
    >
      <item.Icon size={26} color="#10B981" strokeWidth={1.75} />
      <View style={styles.text}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  containerFullWidth: {
    flex: 0,
  },
  text: {
    gap: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 17,
  },
  subtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 15,
  },
});
