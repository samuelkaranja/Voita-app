import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { PendingRequest } from '../../../types/community';
import { formatRelativeTime } from '../../../utils/formatTime';

interface PendingRequestCardProps {
  request: PendingRequest;
  onCancel: (roomId: string) => void;
}

export default function PendingRequestCard({
  request,
  onCancel,
}: PendingRequestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarFallback} />

      <View style={styles.content}>
        <Text style={styles.title}>{request.roomName}</Text>
        <View style={styles.statusRow}>
          <Clock size={13} color={colors.textMuted} />
          <Text style={styles.statusText}>Awaiting approval</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.time}>
          Requested {formatRelativeTime(request.requestedAt)}
        </Text>
        <Pressable onPress={() => onCancel(request.roomId)} hitSlop={8}>
          <Text style={styles.cancel}>Cancel Request</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    marginRight: 12,
  },
  content: { flex: 1 },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  statusText: { color: colors.textMuted, fontSize: 12, marginLeft: 5 },
  meta: { alignItems: 'flex-end' },
  time: { color: colors.textMuted, fontSize: 11, marginBottom: 6 },
  cancel: {
    color: colors.textSecondary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
