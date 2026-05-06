import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CommunityHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Hub</Text>
      <Text style={styles.subtitle}>
        Your network for support, insights, and services
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#001810',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#cfe7dd',
    marginTop: 4,
  },
});
