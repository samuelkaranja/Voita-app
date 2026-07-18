import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Compass } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

interface BrowseAllRoomsCTAProps {
  roomCount?: number;
  onPress: () => void;
}

export default function BrowseAllRoomsCTA({
  roomCount = 45,
  onPress,
}: BrowseAllRoomsCTAProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.iconCircle}>
        <Compass size={22} color={colors.accent} />
      </View>
      <Text style={styles.title}>Browse All Rooms</Text>
      <Text style={styles.subtitle}>
        Join {roomCount}+ other local brand communities and location chats.
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  pressed: { opacity: 0.7 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
