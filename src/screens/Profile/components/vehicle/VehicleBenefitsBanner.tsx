import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BellRing } from 'lucide-react-native';

export const VehicleBenefitsBanner: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.iconWrap}>
      <BellRing size={16} color="#2563EB" strokeWidth={2} />
    </View>
    <View style={styles.textWrap}>
      <Text style={styles.title}>Stay ahead of renewals</Text>
      <Text style={styles.subtitle}>
        Keep your vehicle details up to date and we'll remind you before your
        insurance or license expires, plus alert you about upcoming service and
        tyre maintenance.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  textWrap: { flex: 1 },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 17,
  },
});
