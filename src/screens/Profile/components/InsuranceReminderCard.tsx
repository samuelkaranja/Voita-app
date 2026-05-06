import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import BaseReminderCard from './BaseReminderCard';

export default function InsuranceReminderCard() {
  return (
    <BaseReminderCard
      backgroundColor="#ffffff"
      leftContent={
        <>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <ShieldCheck size={18} color="#0A8F5A" />
          </View>

          <View>
            <Text style={styles.title}>Insurance Renewal</Text>
            <Text style={styles.subtitle}>Due in 14 days</Text>
          </View>
        </>
      }
      rightContent={
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACTION REQUIRED</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#001810', fontWeight: '700', fontSize: 16 },
  subtitle: { fontSize: 12, color: '#666' },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
});
