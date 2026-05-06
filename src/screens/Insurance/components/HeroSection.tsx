import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HeroSection() {
  return (
    <View style={styles.container}>
      <View style={styles.leftBorder} />

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>INSURANCE ECOSYSTEM</Text>

        <Text style={styles.title}>Protect Your Digital & Physical Roots.</Text>

        <Text style={styles.description}>
          Secure your fleet with botanical precision. Select coverage that grows
          with your needs, from telematics to artisanal asset protection.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 64,
  },
  leftBorder: {
    width: 5,
    backgroundColor: '#0A5C4A',
    marginRight: 30,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006c52',
    marginBottom: 6,
    letterSpacing: 2,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#0A1F1A',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: '#414845',
    lineHeight: 25,
  },
});
