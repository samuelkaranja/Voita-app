import React from 'react';
import { StatusBar, ScrollView, StyleSheet } from 'react-native';
import MarketplaceHero from './components/MarketplaceHero';
import MarketplaceSearch from './components/MarketplaceSearch';
import MarketplaceServices from './components/MarketplaceServices';
import MarketplaceProviders from './components/MarketplaceProviders';
import JoinNetworkCard from './components/JoinNetworkCard';

const PROVIDERS_DATA = [
  {
    id: '1',
    name: 'Greenwood Precision Motors',
    imageUrl: require('../../assets/images/marketplace/greenwood.png'),
    rating: 4.9,
    reviewCount: 218,
    isVerified: true,
    promoLabel: 'VERAGUARD PARTNER',
    distance: 0.8,
    description:
      'Specializing in German engineering and hybrid maintenance. Direct billing available...',
    priceLevel: '$$$$',
    buttonLabel: 'BOOK NOW',
  },
  {
    id: '2',
    name: 'Elite Auto Care',
    imageUrl: require('../../assets/images/marketplace/elite.png'),
    rating: 4.7,
    reviewCount: '1.2k',
    isVerified: false,
    promoLabel: 'TOP RATED',
    distance: 1.5,
    description:
      'Full-service maintenance and diagnostics with state-of-the-art equipment.',
    priceLevel: '$$$',
    buttonLabel: 'VIEW DETAILS',
  },
  {
    id: '3',
    name: 'Downtown Hybrid Hub',
    imageUrl: require('../../assets/images/marketplace/downtown.png'),
    rating: 4.8,
    reviewCount: 95,
    isVerified: true,
    promoLabel: 'NEW PARTNER',
    distance: 2.1,
    description:
      'The experts in electric and hybrid engine efficiency and battery health.',
    priceLevel: '$$',
    buttonLabel: 'RESERVE',
  },
];

export default function MarketplaceScreen() {
  return (
    <>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MarketplaceHero />
        <MarketplaceSearch />
        <MarketplaceServices />
        <MarketplaceProviders providers={PROVIDERS_DATA} />
        <JoinNetworkCard />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7F6',
  },
});
