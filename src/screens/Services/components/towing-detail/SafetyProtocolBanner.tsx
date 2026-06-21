import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

interface SafetyProtocolBannerProps {
  version: string;
  description: string;
}

export const SafetyProtocolBanner: React.FC<SafetyProtocolBannerProps> = ({
  version,
  description,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <ShieldCheck size={24} color="#10B981" strokeWidth={2} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Safety Protocol {version}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16,185,129,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 17,
  },
});
