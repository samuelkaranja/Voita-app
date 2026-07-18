import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Briefcase, ChevronDown, ChevronUp, Clock } from 'lucide-react-native';
import { PendingRequest } from '../../../types/community';
import { colors } from '../../../theme/colors';

export default function PendingRequestsStrip({
  requests,
}: {
  requests: PendingRequest[];
}) {
  const [expanded, setExpanded] = useState(true);
  if (requests.length === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setExpanded(e => !e)}>
        <Briefcase size={16} color={colors.textSecondary} />
        <Text style={styles.headerText}>
          Pending Requests ({requests.length})
        </Text>
        {expanded ? (
          <ChevronUp size={16} color={colors.textMuted} />
        ) : (
          <ChevronDown size={16} color={colors.textMuted} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.chipRow}>
          {requests.map(request => (
            <View key={request.id} style={styles.chip}>
              <Clock size={12} color={colors.textMuted} />
              <Text style={styles.chipText}>{request.roomName}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: { color: colors.textSecondary, fontSize: 12, marginLeft: 6 },
});
