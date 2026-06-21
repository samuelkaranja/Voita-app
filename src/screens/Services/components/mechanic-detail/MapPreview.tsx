import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Navigation } from 'lucide-react-native';

interface MapPreviewProps {
  onGetDirections: () => void;
  staticMapUri?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  onGetDirections,
  staticMapUri,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        {staticMapUri ? (
          <Image
            source={{ uri: staticMapUri }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.mapPlaceholder} />
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onGetDirections}
        activeOpacity={0.8}
      >
        <Navigation size={16} color="#10B981" strokeWidth={2.5} />
        <Text style={styles.buttonText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mapArea: {
    height: 150,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D1FAE5',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
