import React from 'react';
import { StyleSheet, ScrollView, StatusBar, View } from 'react-native';

// 1. Import the safe area hook from the context library
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HeroSection from './components/HeroSection';
import HonestyPledge from './components/HonestyPledge';
import ClaimNarrative from './components/ClaimNarrative';
import MediaCapture from './components/MediaCapture';
import SubmitFooter from './components/SubmitFooter';

export default function ClaimsScreen() {
  // 2. Initialize the safe area insets hook
  const insets = useSafeAreaInsets();

  const handleClaimSubmit = () => {
    console.log('Claim submitted successfully');
  };

  return (
    // 3. Changed root from SafeAreaView to View to unlock edge-to-edge rendering
    <View style={styles.container}>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        // 4. Calculate dynamic bottom clearance for the absolute floating tab bar
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 },
        ]}
      >
        <HeroSection userName="Samuel" />
        <HonestyPledge />

        <ClaimNarrative />
        <MediaCapture />

        <SubmitFooter onSubmit={handleClaimSubmit} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faf8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
});
