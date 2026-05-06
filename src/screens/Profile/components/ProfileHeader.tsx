import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>WELCOME BACK</Text>
      <Text style={styles.title}>Hello, Samuel</Text>
      <Text style={styles.subtitle}>
        Your sanctuary on the road is protected and ready for the journey ahead.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  welcome: {
    fontSize: 10,
    color: '#006c52',
    fontWeight: '700',
    letterSpacing: 1,
    paddingTop: 10,
  },
  title: {
    color: '#001810',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
    paddingTop: 10,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#414845',
    lineHeight: 20,
    maxWidth: 320,
  },
});
