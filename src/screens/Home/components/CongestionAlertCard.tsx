import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrafficCone, X } from 'lucide-react-native';

interface CongestionAlertCardProps {
  title: string;
  subtitle: string;
  onClose?: () => void;
}

export default function CongestionAlertCard({
  title,
  subtitle,
  onClose,
}: CongestionAlertCardProps) {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={18} color="#001810" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <TrafficCone size={24} color="#0d2b1f" />
        </View>

        {/* Right Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffffe6',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconContainer: {
    marginRight: 14,
    marginTop: 2,
  },

  textContainer: {
    flex: 1,
    paddingRight: 24,
  },

  title: {
    color: '#001810',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#335046',
    fontSize: 13,
    lineHeight: 20,
  },
});
