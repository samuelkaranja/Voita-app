import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.card}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#e6e9e7',
    padding: 20,
    borderRadius: 24,
    gap: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: '#414845',
    letterSpacing: 0.5,
    marginTop: 5,
  },
  value: {
    color: '#001810',
    fontSize: 15,
    fontWeight: '700',
  },
});
