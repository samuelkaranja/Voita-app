import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { MapPin } from 'lucide-react-native';

export default function CoverageMap() {
  return (
    <ImageBackground
      source={require('../../../assets/images/insurance/map.png')}
      style={styles.container}
      imageStyle={styles.image}
    >
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <MapPin size={18} color="#fff" />
        <Text style={styles.text}>ACTIVE COVERAGE AREA</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e3e1',
    opacity: 0.8,
    zIndex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  text: {
    marginTop: 6,
    color: '#fff',
    fontSize: 12,
  },
});
