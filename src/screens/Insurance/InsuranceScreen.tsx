import React from 'react';
import { StatusBar, ScrollView, StyleSheet, View } from 'react-native';

// 1. Import the safe area hook
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HeroSection from './components/HeroSection';
import PlansSection from './components/PlansSection';
import SynergySection from './components/SynergySection';
import QuickActions from './components/QuickActions';
import HardwareIntegration from './components/HardwareIntegration';
import CoverageMap from './components/CoverageMap';
import PolicyExtensions from './components/PolicyExtensions';

export default function InsuranceScreen() {
  // 2. Initialize the safe area insets
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      {/* 3. Handle scroll canvas padding with contentContainerStyle */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollCanvas,
          { paddingBottom: insets.bottom + 95 },
        ]}
      >
        <HeroSection />

        <PlansSection />

        <View style={styles.section}>
          <SynergySection />
          <QuickActions />
          <HardwareIntegration />
          <CoverageMap />
        </View>

        <PolicyExtensions />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faf8',
  },
  scrollCanvas: {
    paddingHorizontal: 25,
    paddingTop: 30, // Replaces top padding safely inside the container lifecycle
  },
  section: {
    marginTop: 20,
    gap: 16,
  },
});
