import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
}

export const SectionHeader: React.FC<Props> = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
});
