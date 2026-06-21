import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoutBioProps {
  text: string;
}

export const ScoutBio: React.FC<ScoutBioProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bio</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  body: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 21,
  },
});
