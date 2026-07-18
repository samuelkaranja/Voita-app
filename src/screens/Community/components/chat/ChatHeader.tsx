import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';

interface ChatHeaderProps {
  roomName: string;
  memberCount: number;
  avatarUrl?: string;
  onMenuPress?: () => void;
}

export default function ChatHeader({
  roomName,
  memberCount,
  avatarUrl,
  onMenuPress,
}: ChatHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <ArrowLeft size={22} color={colors.headerText} />
      </Pressable>

      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]} />
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {roomName}
        </Text>
        <Text style={styles.members}>
          {memberCount.toLocaleString()} MEMBERS
        </Text>
      </View>

      <Pressable onPress={onMenuPress} hitSlop={12}>
        <MoreVertical size={22} color={colors.headerText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: colors.headerBackground,
  },
  avatar: { width: 34, height: 34, borderRadius: 17, marginLeft: 12 },
  avatarFallback: { backgroundColor: colors.surfaceMuted },
  info: { flex: 1, marginLeft: 10 },
  name: { color: colors.headerText, fontSize: 16, fontWeight: '700' },
  members: {
    color: colors.headerTextSecondary,
    fontSize: 11,
    letterSpacing: 0.4,
    marginTop: 1,
  },
});
