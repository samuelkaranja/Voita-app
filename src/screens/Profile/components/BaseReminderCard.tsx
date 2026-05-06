import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function BaseReminderCard({
  leftContent,
  rightContent,
  backgroundColor = '#F3F4F6',
}: {
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
  backgroundColor?: string;
}) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.left}>{leftContent}</View>
      {rightContent && <View>{rightContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
