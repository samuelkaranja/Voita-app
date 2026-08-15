import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { CommunityRoom } from '../../../types/community';
import { formatRoomListTime } from '../../../utils/formatTime';

interface BrandRoomCardProps {
  room: CommunityRoom;
  onPress: (room: CommunityRoom) => void;
}

export default function BrandRoomCard({ room, onPress }: BrandRoomCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = !!room.iconUrl && !imageError;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(room)}
    >
      {showImage ? (
        <Image
          source={{ uri: room.iconUrl }}
          style={styles.avatar}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]} />
      )}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.time}>
            {formatRoomListTime(room.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.preview} numberOfLines={1}>
            {room.lastMessage}
          </Text>
          {room.unreadCount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{room.unreadCount}</Text>
            </View>
          ) : (
            <CheckCheck size={16} color={colors.textMuted} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 3,
  },
  pressed: { opacity: 0.85 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: colors.surfaceMuted,
  },
  avatarFallback: { backgroundColor: colors.surfaceMuted },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  time: { color: colors.textMuted, fontSize: 12 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: colors.accentDark,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
});
