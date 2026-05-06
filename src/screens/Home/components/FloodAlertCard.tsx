import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';

interface FloodAlertCardProps {
  title: string;
  subtitle: string;
  onClose?: () => void;
}

export default function FloodAlertCard({
  title,
  subtitle,
  onClose,
}: FloodAlertCardProps) {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={18} color="#fff" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Left Icon */}
        <View style={styles.iconContainer}>
          <AlertTriangle size={24} color="#8ff6d0" />
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
    backgroundColor: '#052f23',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
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
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#d7efe6',
    fontSize: 13,
    lineHeight: 20,
  },
});
