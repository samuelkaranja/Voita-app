import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

export default function QuickActions() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>QUICK ACTIONS</Text>

      <View style={styles.button}>
        <AlertTriangle size={18} color="#fff" />
        <Text style={styles.text}>Report a Claim</Text>
      </View>

      <Text style={styles.sub}>24/7 RESPONSE GUARANTEED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#414845',
    lineHeight: 16,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sub: {
    marginTop: 8,
    fontSize: 10,
    textAlign: 'center',
    color: '#414845',
  },
});
