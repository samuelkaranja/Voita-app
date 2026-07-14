import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ServicesHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.subtitle}>Find trusted car services near you</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
});
