import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SlidersVertical, ChevronRight } from 'lucide-react-native';

export default function TireConfigCard() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.left}>
        <View style={styles.icon}>
          <SlidersVertical color="#8ff6d0" size={25} />
        </View>
        <View>
          <Text style={styles.label}>TIRE CONFIGURATION</Text>
          <Text style={styles.value}>All-Terrain Performance</Text>
        </View>
      </View>

      <ChevronRight color="#A7F3D0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    backgroundColor: '#001810',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    backgroundColor: '#052f23',
    borderRadius: 16,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#d1fae580',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 3,
  },
});
