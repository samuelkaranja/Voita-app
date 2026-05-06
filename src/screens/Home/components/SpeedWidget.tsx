import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SpeedWidget({ speed }: any) {
  const kmh = speed ? (speed * 3.6).toFixed(1) : '0.0';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Speed</Text>
      <Text style={styles.value}>{kmh} km/h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(13, 43, 31, 0.9)',
    paddingVertical: 30,
    paddingHorizontal: 18,
    borderRadius: 16,

    // 👇 change alignment
    alignItems: 'flex-start',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  label: {
    color: '#8ff6d0',
    fontSize: 18,
    marginBottom: 4,
    letterSpacing: 1,
  },

  value: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '600',
  },
});
