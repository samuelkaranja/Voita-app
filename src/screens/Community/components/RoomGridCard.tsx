import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Clock } from 'lucide-react-native';
import { BrowseRoom } from '../../../types/community';
import { colors } from '../../../theme/colors';
import { formatRelativeTime } from '../../../utils/formatTime';

interface RoomGridCardProps {
  room: BrowseRoom;
  onJoin: (roomId: string) => void;
  onOpen: (room: BrowseRoom) => void;
  isJoining?: boolean;
}

export default function RoomGridCard({
  room,
  onJoin,
  onOpen,
  isJoining,
}: RoomGridCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = !!room.iconUrl && !imageError;
  const isJoined = room.status === 'joined';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && isJoined && styles.pressed,
      ]}
      onPress={() => isJoined && onOpen(room)}
      disabled={!isJoined}
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

      <Text style={styles.name} numberOfLines={2}>
        {room.name}
      </Text>
      <Text style={styles.members}>
        {room.memberCount.toLocaleString()} MEMBERS
      </Text>

      <View style={styles.footer}>
        {room.status === 'joined' && (
          <View style={styles.joinedRow}>
            <Check size={14} color={colors.accent} />
            <Text style={styles.joinedText}>Joined</Text>
          </View>
        )}

        {room.status === 'pending' && (
          <View>
            <View style={[styles.button, styles.buttonDisabled]}>
              <Clock size={13} color={colors.textMuted} />
              <Text style={styles.buttonDisabledText}>Pending Approval</Text>
            </View>
            {!!room.requestedAt && (
              <Text style={styles.requestedAt}>
                Requested {formatRelativeTime(room.requestedAt)}
              </Text>
            )}
          </View>
        )}

        {room.status === 'available' && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonActive,
              pressed && styles.pressed,
            ]}
            onPress={() => onJoin(room.id)}
            disabled={isJoining}
          >
            <Text style={styles.buttonActiveText}>
              {isJoining ? 'Requesting…' : 'Join Room'}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 14,
    margin: 6,
    minHeight: 170,
  },
  pressed: { opacity: 0.8 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  avatarFallback: { backgroundColor: colors.surfaceMuted },
  name: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  members: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  footer: { marginTop: 'auto' },
  joinedRow: { flexDirection: 'row', alignItems: 'center' },
  joinedText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 9,
  },
  buttonActive: { backgroundColor: colors.accent },
  buttonActiveText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonDisabled: { backgroundColor: 'transparent' },
  buttonDisabledText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  requestedAt: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});
