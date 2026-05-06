import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IdCard } from 'lucide-react-native';
import BaseReminderCard from './BaseReminderCard';

export default function LicenseReminderCard() {
  return (
    <BaseReminderCard
      backgroundColor="#ffffff"
      leftContent={
        <>
          <View style={styles.iconBox}>
            <IdCard size={18} color="#6B7280" />
          </View>

          <View>
            <Text style={styles.title}>Driving License</Text>
            <Text style={styles.subtitle}>Expires Oct 2025</Text>
          </View>
        </>
      }
      rightContent={
        <View style={styles.activeBadge}>
          <View style={styles.dot} />
          <Text style={styles.activeText}>ACTIVE</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontWeight: '700', fontSize: 14 },
  subtitle: { fontSize: 12, color: '#666' },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
});
