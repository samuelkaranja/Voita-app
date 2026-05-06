import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, Cpu, CheckCircle, Plus } from 'lucide-react-native';

export default function HardwareIntegration() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>HARDWARE INTEGRATION</Text>

      <View style={styles.item}>
        <Camera size={20} color="#006c52" />
        <Text style={styles.text}>Ultra-HD Dashcam</Text>
        <Plus size={18} color="#c1c8c3" />
      </View>

      <View style={styles.item}>
        <Cpu size={20} color="#006c52" />
        <Text style={styles.text}>OBDC II Sensor</Text>
        <CheckCircle size={18} color="#006c52" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6e9e7',
    padding: 24,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 16,
    marginBottom: 15,
    color: '#414845',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#001810',
    lineHeight: 20,
    marginLeft: 10,
  },
});
