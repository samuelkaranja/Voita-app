import React from 'react';
import { StatusBar, ScrollView, StyleSheet, View } from 'react-native';

import HeroSection from './components/HeroSection';
import PlansSection from './components/PlansSection';
import SynergySection from './components/SynergySection';
import QuickActions from './components/QuickActions';
import HardwareIntegration from './components/HardwareIntegration';
import CoverageMap from './components/CoverageMap';
import PolicyExtensions from './components/PolicyExtensions';

export default function InsuranceScreen() {
  return (
    <>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  section: {
    marginTop: 20,
    gap: 16,
  },
});
