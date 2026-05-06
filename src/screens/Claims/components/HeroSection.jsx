import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function HeroSection({ userName }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>CLAIMS SUPPORT</Text>
      <Text style={styles.title}>We're here to help, {userName}.</Text>
      <Text style={styles.description}>
        Take a deep breath. We've got you covered. No police abstract required.
        We trust your voice.
      </Text>
      <View style={styles.statsCard}>
        <View style={styles.avatarStack}>
          <View
            style={[styles.avatar, { backgroundColor: '#C1EBD0', zIndex: 3 }]}
          />
          <View
            style={[
              styles.avatar,
              { backgroundColor: '#98D8AA', zIndex: 2, marginLeft: -15 },
            ]}
          />
          <View
            style={[
              styles.avatar,
              { backgroundColor: '#76C893', zIndex: 1, marginLeft: -15 },
            ]}
          />
        </View>
        <View>
          <Text style={styles.statsTextBold}>4,000+ honest claims</Text>
          <Text style={styles.statsTextSmall}>settled this week alone</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006c52',
    letterSpacing: 1,
    lineHeight: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#001810',
    lineHeight: 50,
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#414845',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f4f2',
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#006c52',
  },
  avatarStack: { flexDirection: 'row', marginRight: 20 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statsTextBold: { fontWeight: '700', fontSize: 14, color: '#001810' },
  statsTextSmall: { fontSize: 12, color: '#414845', lineHeight: 16 },
});
