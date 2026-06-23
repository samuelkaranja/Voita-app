import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wrench } from 'lucide-react-native';
import BaseReminderCard from './BaseReminderCard';

export default function ServiceReminderCard() {
  return (
    <BaseReminderCard
      backgroundColor="#ffffff"
      leftContent={
        <>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Wrench size={18} color="#DC2626" />
          </View>

          <View>
            <Text style={styles.title}>Car Service</Text>
            <Text style={styles.overdue}>Overdue by 250 KM</Text>
          </View>
        </>
      }
      rightContent={
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
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
  title: { fontWeight: '700', fontSize: 14 },
  overdue: { fontSize: 12, color: '#DC2626' },
  button: {
    backgroundColor: '#022C22',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
