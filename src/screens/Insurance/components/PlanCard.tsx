import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Activity, Gauge, Shield, Users } from 'lucide-react-native';

export default function PlanCard({ type, title, description, dark }: any) {
  const icons: any = {
    telematics: Activity,
    pay: Gauge,
    classic: Shield,
    group: Users,
  };

  const Icon = icons[type];

  return (
    <View style={[styles.card, dark && styles.darkCard]}>
      <Icon size={30} color={dark ? '#fff' : '#0A5C4A'} />

      <Text style={[styles.title, dark && styles.darkText]}>{title}</Text>

      <Text style={[styles.desc, dark && styles.darkText]}>{description}</Text>

      <Text style={[styles.button, dark && styles.darkButton]}>
        {dark ? 'SELECT PLAN' : 'EXPLORE POLICY →'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f1f4f2',
    padding: 32,
    borderRadius: 18,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 1,
  },
  darkCard: {
    backgroundColor: '#052f23',
  },
  title: {
    marginTop: 14,
    fontWeight: '700',
    fontSize: 22,
    color: '#001810',
    lineHeight: 32,
  },
  desc: {
    fontSize: 14,
    color: '#414845',
    marginTop: 7,
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
  button: {
    marginTop: 16,
    fontSize: 14,
    color: '#0A5C4A',
    fontWeight: '600',
  },
  darkButton: {
    color: '#fff',
  },
});
