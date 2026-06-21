import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, AlertTriangle, Phone } from 'lucide-react-native';

interface EmergencyBannerProps {
  onDispatch: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onDispatch,
}) => {
  return (
    <View style={styles.container}>
      {/* Watermark icon */}
      <View style={styles.watermark}>
        <AlertTriangle size={90} color="#FFFFFF" strokeWidth={1.5} />
      </View>

      {/* Header row */}
      <View style={styles.headerRow}>
        <AlertCircle size={18} color="#EF4444" strokeWidth={2.5} />
        <Text style={styles.eyebrow}>EMERGENCY RESPONSE</Text>
      </View>

      <Text style={styles.title}>Immediate Assistance</Text>
      <Text style={styles.subtitle}>
        Stranded? Get a professional tow truck dispatched to your exact location
        in minutes.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onDispatch}
        activeOpacity={0.85}
      >
        <Phone size={18} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
        <Text style={styles.buttonText}>Dispatch Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A2332',
    borderRadius: 16,
    padding: 20,
    gap: 10,
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: -10,
    top: -10,
    opacity: 0.07,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
