import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/colors';
import { ONBOARDING_SLIDES, OnboardingSlideData } from './data';
import OnboardingSlide from './OnboardingSlide';
import OnboardingFooter from './OnboardingFooter';
import { AuthStackParamList } from '../../navigation/AuthStack'; // adjust path if needed

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INTRO_SEEN_KEY = 'voita_has_seen_intro';

type IntroScreenNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Intro'
>;

const IntroScreen = () => {
  const navigation = useNavigation<IntroScreenNavProp>();
  const flatListRef = useRef<FlatList<OnboardingSlideData>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to persist onboarding flag:', error);
      }
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [navigation]);

  const handleNext = useCallback(() => {
    const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;
    if (isLastSlide) {
      completeOnboarding();
      return;
    }
    flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
  }, [activeIndex, completeOnboarding]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
      );
      setActiveIndex(index);
    },
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OnboardingSlide
            Illustration={item.Illustration}
            title={item.title}
            description={item.description}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.list}
      />

      <OnboardingFooter
        total={ONBOARDING_SLIDES.length}
        activeIndex={activeIndex}
        isLastSlide={activeIndex === ONBOARDING_SLIDES.length - 1}
        onSkip={completeOnboarding}
        onNext={handleNext}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.onboardingBg,
  },
  list: {
    flex: 1,
  },
});

export default IntroScreen;
