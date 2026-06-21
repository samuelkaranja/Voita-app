import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface LoyaltyPassBannerProps {
  title: string;
  subtitle: string;
  savingsLabel: string;
  onPress: () => void;
}

export const LoyaltyPassBanner: React.FC<LoyaltyPassBannerProps> = ({
  title,
  subtitle,
  savingsLabel,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.savingsRow}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.savings}>{savingsLabel}</Text>
        <ChevronRight size={18} color="#10B981" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  textBlock: {
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  savings: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
});
