import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SpeedWidgetProps = {
  speed: number | null;
};

export default function SpeedWidget({ speed }: SpeedWidgetProps) {
  const kmh = speed ? Math.round(speed * 3.6) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{kmh}</Text>
      <Text style={styles.unit}>km/h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(13, 43, 31, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 64,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  unit: {
    color: '#8ff6d0',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
