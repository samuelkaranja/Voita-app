import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import ImageMessageCard from './ImageMessageCard';
import LocationMessageCard from './LocationMessageCard';
import { ChatMessage } from '../../../../types/chat';
import { colors } from '../../../../theme/colors';
import { formatMessageTime } from '../../../../utils/formatTime';

interface MessageBubbleProps {
  message: ChatMessage;
  onOpenLocation?: (message: ChatMessage) => void;
}

export default function MessageBubble({
  message,
  onOpenLocation,
}: MessageBubbleProps) {
  const [avatarError, setAvatarError] = useState(false);
  const isOwn = message.isOwnMessage;
  const showAvatar = !!message.senderAvatar && !avatarError;

  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      {!isOwn &&
        (showAvatar ? (
          <Image
            source={{ uri: message.senderAvatar }}
            style={styles.avatar}
            onError={() => setAvatarError(true)}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        ))}

      <View style={[styles.column, isOwn && styles.columnOwn]}>
        {!isOwn && <Text style={styles.senderName}>{message.senderName}</Text>}

        {message.type === 'text' && (
          <View
            style={[
              styles.bubble,
              isOwn ? styles.bubbleOwn : styles.bubbleOther,
            ]}
          >
            <Text style={styles.bubbleText}>{message.text}</Text>
          </View>
        )}

        {message.type === 'image' && (
          <ImageMessageCard
            imageUrl={message.imageUrl ?? ''}
            caption={message.text}
          />
        )}

        {message.type === 'location' && message.location && (
          <LocationMessageCard
            label="current location"
            address={message.location.label}
            mapPreviewUrl={message.location.mapPreviewUrl}
            onOpen={() => onOpenLocation?.(message)}
          />
        )}

        <View style={[styles.metaRow, isOwn && styles.metaRowOwn]}>
          <Text style={styles.time}>
            {formatMessageTime(message.createdAt)}
          </Text>
          {isOwn && (
            <CheckCheck
              size={13}
              color={colors.textMuted}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  rowOwn: { justifyContent: 'flex-end' },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  avatarFallback: { backgroundColor: colors.surfaceMuted },
  column: { maxWidth: '78%' },
  columnOwn: { alignItems: 'flex-end' },
  senderName: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
    marginLeft: 2,
  },
  bubble: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  bubbleOther: {
    backgroundColor: colors.cardBackground,
    borderBottomLeftRadius: 4,
  },
  bubbleOwn: { backgroundColor: colors.accentDark, borderBottomRightRadius: 4 },
  bubbleText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaRowOwn: { justifyContent: 'flex-end' },
  time: { color: colors.textMuted, fontSize: 11 },
});
