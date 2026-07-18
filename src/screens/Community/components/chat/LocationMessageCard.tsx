import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';

interface LocationMessageCardProps {
  label: string;
  address: string;
  mapPreviewUrl?: string;
  onOpen?: () => void;
}

export default function LocationMessageCard({
  label,
  address,
  mapPreviewUrl,
  onOpen,
}: LocationMessageCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = !!mapPreviewUrl && !imageError;

  return (
    <View style={styles.container}>
      {showImage ? (
        <Image
          source={{ uri: mapPreviewUrl }}
          style={styles.mapImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.mapPreview}>
          <MapPin size={26} color={colors.accent} />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.textBlock}>
          <Text style={styles.label}>{label.toUpperCase()}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <Pressable style={styles.openButton} onPress={onOpen}>
          <Text style={styles.openText}>OPEN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  mapImage: { width: '100%', height: 120 },
  mapPreview: {
    height: 120,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  textBlock: { flex: 1 },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  address: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  openButton: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  openText: { color: colors.textPrimary, fontSize: 11, fontWeight: '700' },
});
