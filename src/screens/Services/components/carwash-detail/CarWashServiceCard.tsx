import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface CarWashServiceEntry {
  id: string;
  label: string;
  description: string;
  price: number;
  Icon: LucideIcon;
  premium?: boolean;
}

interface CarWashServiceCardProps {
  item: CarWashServiceEntry;
  onAddToBooking: (id: string) => void;
}

export const CarWashServiceCard: React.FC<CarWashServiceCardProps> = ({
  item,
  onAddToBooking,
}) => {
  const isPremium = !!item.premium;

  return (
    <View style={[styles.container, isPremium && styles.containerPremium]}>
      {/* Icon + Price row */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, isPremium && styles.iconBoxPremium]}>
          <item.Icon
            size={22}
            color={isPremium ? '#10B981' : '#374151'}
            strokeWidth={1.75}
          />
        </View>
        <Text style={[styles.price, isPremium && styles.pricePremium]}>
          ${item.price}
        </Text>
      </View>

      {/* Name + Description */}
      <View style={styles.textBlock}>
        <Text style={[styles.label, isPremium && styles.labelPremium]}>
          {item.label}
        </Text>
        <Text
          style={[styles.description, isPremium && styles.descriptionPremium]}
        >
          {item.description}
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.button, isPremium && styles.buttonPremium]}
        onPress={() => onAddToBooking(item.id)}
        activeOpacity={0.8}
      >
        <Text
          style={[styles.buttonText, isPremium && styles.buttonTextPremium]}
        >
          {isPremium ? 'Book Premium' : 'Add to Booking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerPremium: {
    backgroundColor: '#111827',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxPremium: {
    backgroundColor: 'rgba(16,185,129,0.12)',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  pricePremium: {
    color: '#FFFFFF',
  },
  textBlock: {
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  labelPremium: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  descriptionPremium: {
    color: '#9CA3AF',
  },
  button: {
    backgroundColor: '#F3F4F6',
    borderRadius: 9,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonPremium: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  buttonTextPremium: {
    color: '#FFFFFF',
  },
});
