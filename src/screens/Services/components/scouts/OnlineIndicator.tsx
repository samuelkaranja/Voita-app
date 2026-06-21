import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OnlineIndicatorProps {
  label: string;
  count: number;
}

export const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  label,
  count,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.count}>{count} Experts Online</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
