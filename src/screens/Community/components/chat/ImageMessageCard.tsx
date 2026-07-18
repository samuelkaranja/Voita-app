import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';

export default function ImageMessageCard({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption?: string;
}) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {!!caption && <Text style={styles.caption}>{caption}</Text>}
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
  image: { width: '100%', height: 160 },
  caption: { color: colors.textPrimary, fontSize: 14, padding: 12 },
});
