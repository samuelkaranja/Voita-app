import React, { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import PaginationDots from './PaginationDots';

interface OnboardingFooterProps {
  total: number;
  activeIndex: number;
  isLastSlide: boolean;
  onSkip: () => void;
  onNext: () => void;
}

const OnboardingFooter: FC<OnboardingFooterProps> = ({
  total,
  activeIndex,
  isLastSlide,
  onSkip,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <PaginationDots total={total} activeIndex={activeIndex} />

      <View
        style={[styles.actionsRow, isLastSlide && styles.actionsRowCentered]}
      >
        {!isLastSlide && (
          <TouchableOpacity onPress={onSkip} hitSlop={12}>
            <Text style={styles.skipText}>skip</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'start' : 'next'}
          </Text>
          {isLastSlide && (
            <ArrowRight
              size={16}
              color={COLORS.onboardingBg}
              strokeWidth={2.5}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    gap: 20,
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionsRowCentered: {
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.onboardingTextMuted,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  nextButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onboardingBg,
  },
});

export default OnboardingFooter;
