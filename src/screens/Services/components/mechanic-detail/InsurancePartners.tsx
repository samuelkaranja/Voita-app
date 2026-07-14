import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Shield } from 'lucide-react-native';
import { InsurancePartner } from '../../../../redux/slices/services/mechanicsSlice';

interface InsurancePartnersProps {
  partners: InsurancePartner[];
}

export const InsurancePartners: React.FC<InsurancePartnersProps> = ({
  partners,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>INSURANCE PARTNERS</Text>
      <View style={styles.grid}>
        {partners.map(partner => (
          <View key={partner.id} style={styles.logoBox}>
            {partner.logo_url ? (
              <Image
                source={{ uri: partner.logo_url }}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <Shield size={22} color="#10B981" strokeWidth={1.5} />
            )}
            <Text style={styles.partnerName} numberOfLines={2}>
              {partner.name}
            </Text>
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
    minHeight: 72,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 6,
  },
  logo: {
    width: '80%',
    height: 36,
  },
  partnerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
