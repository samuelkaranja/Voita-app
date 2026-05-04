import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Map } from 'lucide-react-native';

export default function ServiceScoutCard() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/community/mechanic.png')} 
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 24 }}
      >
        {/* Dark overlay to match the Emergency.png aesthetic */}
        <View style={styles.overlay}>
          
          <View style={styles.tag}>
            <Text style={styles.tagText}>SERVICE SCOUT</Text>
          </View>

          <Text style={styles.title}>
            On-Demand{"\n"}Technicians
          </Text>

          <Text style={styles.description}>
            Facing mechanical issues? Request a verified VeraGuard Scout to your current location for diagnostics or rescue.
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Call for Scout</Text>
            <Map color="#FFFFFF" size={20} style={styles.icon} />
          </TouchableOpacity>
          
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginVertical: 20,
  },
  backgroundImage: {
    width: '100%',
    minHeight: 280,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 24,
    padding: 30,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: 'rgba(125, 249, 184, 0.2)', // Tinted version of the mint color
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  tagText: {
    color: '#7df9b8',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 12,
  },
  description: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: '90%',
  },
  button: {
    backgroundColor: '#065f46', // Deep forest green
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    marginLeft: 4,
  },
});
