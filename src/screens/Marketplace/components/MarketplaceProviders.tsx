import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ProviderCard from './ProviderCard';

export default function MarketplaceProviders({ providers }) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top Rated Nearby</Text>
        <View>
          <Text style={styles.linkText}>View All</Text>
        </View>
      </View>

      {providers.map(item => (
        <ProviderCard
          key={item.id}
          provider={item}
          onBookNow={() => console.log(`Booking ${item.name}`)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002e2c',
    lineHeight: 32,
  },
  linkText: {
    fontSize: 14,
    color: '#00796b',
    textAlign: 'right',
    fontWeight: '600',
  },
});
