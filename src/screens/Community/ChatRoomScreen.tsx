import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ChatHeader from './components/chat/ChatHeader';
import RulesBanner from './components/chat/RulesBanner';
import MessageBubble from './components/chat/MessageBubble';
import ChatInputBar from './components/chat/ChatInputBar';
import { colors } from '../../theme/colors';
import {
  fetchRoomMessages,
  seedRoomMeta,
  sendTextMessage,
} from '../../redux/slices/chat/chatSlice';
import { CommunityStackParamList } from '../../navigation/CommunityStack';

type ChatRoomRouteProp = RouteProp<CommunityStackParamList, 'ChatRoom'>;

export default function ChatRoomScreen() {
  const { params } = useRoute<ChatRoomRouteProp>();
  const {
    roomId,
    roomName,
    memberCount: memberCountParam,
    avatarUrl: avatarUrlParam,
  } = params;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      seedRoomMeta({
        roomId,
        roomName,
        memberCount: memberCountParam,
        avatarUrl: avatarUrlParam,
      }),
    );
    dispatch(fetchRoomMessages(roomId));
  }, [dispatch, roomId, roomName, memberCountParam, avatarUrlParam]);

  const room = useAppSelector(state => state.chat.roomsById[roomId]);
  const messages = room?.messages ?? [];
  const memberCount = room?.memberCount ?? memberCountParam ?? 0;
  const avatarUrl = room?.avatarUrl ?? avatarUrlParam;
  const rulesText = room?.rulesText ?? 'Be respectful — road safety tips only';

  const handleSend = useCallback(
    (text: string) => dispatch(sendTextMessage({ roomId, text })),
    [dispatch, roomId],
  );

  return (
    <View style={styles.container}>
      <ChatHeader
        roomName={roomName}
        memberCount={memberCount}
        avatarUrl={avatarUrl}
      />
      <RulesBanner text={rulesText} />

      <FlatList
        data={messages}
        keyExtractor={message => message.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <ChatInputBar roomName={roomName} onSend={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: { flex: 1 },
  listContent: { paddingVertical: 16 },
});
