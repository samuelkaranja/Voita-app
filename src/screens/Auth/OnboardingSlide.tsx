import React, { FC } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = 220;

interface OnboardingSlideProps {
  Illustration: FC<SvgProps>;
  title: string;
  description: string;
}

const OnboardingSlide: FC<OnboardingSlideProps> = ({
  Illustration,
  title,
  description,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Illustration width={CIRCLE_SIZE * 0.75} height={CIRCLE_SIZE * 0.75} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.onboardingCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default OnboardingSlide;
