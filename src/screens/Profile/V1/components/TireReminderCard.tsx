import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import BaseReminderCard from './BaseReminderCard';

export default function TireReminderCard() {
  return (
    <BaseReminderCard
      backgroundColor="#ffffff"
      leftContent={
        <>
          <View style={styles.iconBox}>
            <CheckCircle size={18} color="#9CA3AF" />
          </View>

          <View>
            <Text style={styles.title}>Tire Expiry</Text>
            <Text style={styles.subtitle}>Healthy · 2 years left</Text>
          </View>
        </>
      }
      rightContent={<CheckCircle size={18} color="#9CA3AF" />}
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
});
