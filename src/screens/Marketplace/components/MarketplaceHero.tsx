import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function MarketplaceHero() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ezra Marketplace</Text>
      <Text style={styles.title}>
        Curated Care for{'\n'}
        <Text style={styles.highlight}>Your Machine.</Text>
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        A botanical archive of verified automotive artisans. From precision
        mechanics to artisanal upholstery, find insurance-partnered services
        with absolute transparency.
      </Text>

      {/* Image */}
      <Image
        source={require('../../../assets/images/marketplace/Hero.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  label: {
    color: '#006c52',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 12,
  },

  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#001810',
    lineHeight: 50,
  },

  highlight: {
    color: '#006c52',
  },

  description: {
    marginTop: 15,
    fontSize: 17,
    lineHeight: 30,
    color: '#414845',
  },

  image: {
    marginTop: 25,
    width: '100%',
    height: width * 0.6,
    borderRadius: 16,
  },
});
