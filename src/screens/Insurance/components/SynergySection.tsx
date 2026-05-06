import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Car } from 'lucide-react-native';

export default function SynergySection() {
  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.row}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Car size={30} color="#000" />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Multi-Car Synergy</Text>

          <Text style={styles.text}>
            Save up to 25% for every additional vehicle added to your archive.
          </Text>
        </View>
      </View>

      {/* Button */}
      <Text style={styles.button}>APPLY DISCOUNT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#052f23',
    padding: 28,
    borderRadius: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // ✅ fixed (number, not string)
  },

  iconContainer: {
    backgroundColor: '#8ff6d0',
    padding: 12,
    borderRadius: 12,
  },

  textContainer: {
    flex: 1, // ✅ prevents overflow
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginTop: 6,
  },

  text: {
    color: '#8ff6d0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    flexShrink: 1, // ✅ ensures wrapping
  },

  button: {
    marginTop: 18,
    backgroundColor: '#fff',
    fontSize: 12,
    color: '#001810',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 50,
    alignSelf: 'center',
    fontWeight: '800',
    overflow: 'hidden', // helps keep rounded pill shape clean
  },
});
