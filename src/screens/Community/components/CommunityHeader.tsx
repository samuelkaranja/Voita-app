import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

interface CommunityHeaderProps {
  title?: string;
  onSearchPress?: () => void;
}

export default function CommunityHeader({
  title = 'Community Chats',
  onSearchPress,
}: CommunityHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
        <ArrowLeft size={24} color={colors.headerText} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onSearchPress} hitSlop={12}>
        <Search size={22} color={colors.headerText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.headerBackground,
  },
  title: { color: colors.headerText, fontSize: 20, fontWeight: '700' },
});
