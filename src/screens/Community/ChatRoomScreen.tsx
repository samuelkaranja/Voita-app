import React, { useCallback, useEffect } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ChatHeader from './components/chat/ChatHeader';
import RulesBanner from './components/chat/RulesBanner';
import MessageBubble from './components/chat/MessageBubble';
import ChatInputBar from './components/chat/ChatInputBar';
import { colors } from '../../theme/colors';
import {
  fetchRoomMessages,
  sendTextMessage,
} from '../../redux/slices/chat/chatSlice';
import { CommunityStackParamList } from '../../navigation/CommunityStack';

type ChatRoomRouteProp = RouteProp<CommunityStackParamList, 'ChatRoom'>;

export default function ChatRoomScreen() {
  const { params } = useRoute<ChatRoomRouteProp>();
  const { roomId, roomName } = params;
  const dispatch = useAppDispatch();

  const room = useAppSelector(state => state.chat.roomsById[roomId]);
  const messages = room?.messages ?? [];
  const memberCount = room?.memberCount ?? 0;
  const rulesText = room?.rulesText ?? 'Be respectful — road safety tips only';

  useEffect(() => {
    dispatch(fetchRoomMessages(roomId));
  }, [dispatch, roomId]);

  const handleSend = useCallback(
    (text: string) => dispatch(sendTextMessage({ roomId, text })),
    [dispatch, roomId],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatHeader roomName={roomName} memberCount={memberCount} />
      <RulesBanner text={rulesText} />

      <FlatList
        data={messages}
        keyExtractor={message => message.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.listContent}
      />

      <ChatInputBar roomName={roomName} onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 88,
  },
  listContent: { paddingVertical: 16 },
});
