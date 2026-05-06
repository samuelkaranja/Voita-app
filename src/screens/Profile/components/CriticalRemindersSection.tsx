import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import InsuranceReminderCard from './InsuranceReminderCard';
import LicenseReminderCard from './LicenseReminderCard';
import ServiceReminderCard from './ServiceReminderCard';
import TireReminderCard from './TireReminderCard';

export default function CriticalRemindersSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Critical Reminders</Text>

      <InsuranceReminderCard />
      <LicenseReminderCard />
      <ServiceReminderCard />
      <TireReminderCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 35,
  },
  title: {
    color: '#001810',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 17,
    lineHeight: 32,
  },
});
