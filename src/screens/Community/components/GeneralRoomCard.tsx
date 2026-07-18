import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';
import { CommunityRoom } from '../../../types/community';
import { colors } from '../../../theme/colors';
import { formatRoomListTime } from '../../../utils/formatTime';

interface GeneralRoomCardProps {
  room: CommunityRoom;
  onPress: (room: CommunityRoom) => void;
}

export default function GeneralRoomCard({
  room,
  onPress,
}: GeneralRoomCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = !!room.iconUrl && !imageError;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(room)}
    >
      <View style={styles.iconWrap}>
        {showImage ? (
          <Image
            source={{ uri: room.iconUrl }}
            style={styles.iconImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <Car size={22} color={colors.textPrimary} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.time}>
            {formatRoomListTime(room.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.subRow}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>
            {room.onlineCount?.toLocaleString()} drivers online
          </Text>
          {!!room.unreadCount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {room.unreadCount > 9 ? '9+' : room.unreadCount}
              </Text>
            </View>
          )}
        </View>

        {!!room.lastMessage && (
          <View style={styles.previewBox}>
            <Text style={styles.previewText} numberOfLines={1}>
              "{room.lastMessage}"
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 14,
    // borderWidth: 1,
    // borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  iconImage: { width: 44, height: 44, borderRadius: 22 },
  content: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: colors.textPrimary, fontSize: 17, fontWeight: '700' },
  time: { color: colors.textMuted, fontSize: 12 },
  subRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  onlineText: { color: colors.textSecondary, fontSize: 13, flex: 1 },
  badge: {
    backgroundColor: colors.accentDark,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  previewBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  previewText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
