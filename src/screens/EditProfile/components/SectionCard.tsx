import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function SectionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    marginVertical: 10,
  },
});
