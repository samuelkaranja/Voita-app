import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { X } from 'lucide-react-native';

type SpeedWidgetProps = {
  speed: number | null;
};

export default function SpeedWidget({ speed }: SpeedWidgetProps) {
  const [visible, setVisible] = useState(true);

  const kmh = speed ? (speed * 3.6).toFixed(1) : '0.0';

  // Hide card when X is pressed
  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setVisible(false)}
      >
        <X size={18} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>

      <Text style={styles.label}>Speed:</Text>
      <Text style={styles.value}>{kmh} km/h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(13, 43, 31, 0.9)',
    paddingVertical: 30,
    paddingHorizontal: 18,
    borderRadius: 16,

    alignItems: 'flex-start',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,

    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,

    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    color: '#8ff6d0',
    fontSize: 16,
    marginBottom: 4,
    letterSpacing: 1,
  },

  value: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
});
