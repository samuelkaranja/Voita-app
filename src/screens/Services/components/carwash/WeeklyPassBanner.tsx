import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WeeklyPassBannerProps {
  onLearnMore: () => void;
}

export const WeeklyPassBanner: React.FC<WeeklyPassBannerProps> = ({
  onLearnMore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Weekly Pass</Text>
        <Text style={styles.body}>
          Unlimited basic exterior washes for just $29/month. Keep your vehicle
          sparkling every day.
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.savings}>Save 40%</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onLearnMore}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 20,
    gap: 28,
  },
  textBlock: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  body: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savings: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
