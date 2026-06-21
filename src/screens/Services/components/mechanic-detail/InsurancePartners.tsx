import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield } from 'lucide-react-native';

export const InsurancePartners: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>INSURANCE PARTNERS</Text>
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.logoBox}>
            <Shield size={22} color="#D1D5DB" strokeWidth={1.5} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  logoBox: {
    width: '47%',
    height: 56,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
