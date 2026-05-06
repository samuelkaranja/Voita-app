import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function HonestyPledge() {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>The Ezra Honesty Pledge</Text>
      <Text style={styles.description}>
        Ezra is built on mutual trust. By being honest about what happened, you
        help keep premiums low for the entire community. We believe in your
        integrity.
      </Text>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setChecked(!checked)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxText}>I pledge to share the truth</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#052f23',
    padding: 32,
    borderRadius: 32,
    marginTop: 28,
    marginBottom: 28,
  },
  title: {
    color: '#8ff6d0',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    color: '#c2ecd9',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  checkboxChecked: { backgroundColor: '#6EE7B7' },
  checkboxText: { color: '#FFF', fontSize: 15, fontWeight: '500' },
});
