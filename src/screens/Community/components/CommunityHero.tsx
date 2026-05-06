import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserPlus, Settings2 } from 'lucide-react-native';

export default function CommunityHero() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.tagline}>THE HUB</Text>
        <Text style={styles.headline}>
          Community Wisdom{'\n'}
          <Text style={styles.highlight}>Protects Every Mile.</Text>
        </Text>

        <Text style={styles.description}>
          Connect with specialists, request technical scouts, or engage in
          brand-specific discussions within the VeraGuard ecosystem.
        </Text>

        <TouchableOpacity style={styles.primaryBtn}>
          <UserPlus color="#052e1f" size={20} />
          <Text style={styles.primaryBtnText}>Contact Expert</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn}>
          <Settings2 color="#7df9b8" size={20} />
          <Text style={styles.secondaryBtnText}>Request Scout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#052e1f',
    paddingVertical: 35,
  },
  content: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  tagline: {
    color: '#7df9b8',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 15,
  },
  headline: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  highlight: {
    color: '#7df9b8',
  },
  description: {
    color: '#a3b8b0',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 25,
  },
  primaryBtn: {
    backgroundColor: '#7df9b8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#052e1f',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a4d40',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryBtnText: {
    color: '#7df9b8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
