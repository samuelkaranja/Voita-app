import React from 'react';
import { StyleSheet, ScrollView, StatusBar } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import HeroSection from './components/HeroSection';
import HonestyPledge from './components/HonestyPledge';
import ClaimNarrative from './components/ClaimNarrative';
import MediaCapture from './components/MediaCapture';
import SubmitFooter from './components/SubmitFooter';

export default function ClaimsScreen() {
  const handleClaimSubmit = () => {
    console.log('Claim submitted successfully');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection userName="Samuel" />
        <HonestyPledge />

        <ClaimNarrative />
        <MediaCapture />

        <SubmitFooter onSubmit={handleClaimSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faf8',
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
