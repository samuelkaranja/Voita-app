import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Camera, Send } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';

interface ChatInputBarProps {
  roomName: string;
  onSend: (text: string) => void;
  onCameraPress?: () => void;
}

export default function ChatInputBar({
  roomName,
  onSend,
  onCameraPress,
}: ChatInputBarProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onCameraPress} hitSlop={10} style={styles.iconButton}>
        <Camera size={24} color={colors.textClear} />
      </Pressable>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={`Message ${roomName}`}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
      />

      <Pressable
        onPress={handleSend}
        disabled={!text.trim()}
        style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
      >
        <Send
          size={18}
          color={text.trim() ? colors.background : colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.textPrimary,
  },
  iconButton: { marginRight: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.headerBackground,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: colors.textClear,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: { backgroundColor: colors.surfaceMuted },
});
