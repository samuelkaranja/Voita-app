import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

const PaginationDots: FC<PaginationDotsProps> = ({ total, activeIndex }) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.onboardingDotInactive,
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
});

export default PaginationDots;
